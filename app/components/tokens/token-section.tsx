import { chainConfig } from "@/config/chain";
import { marketplaceAbi } from "@/contracts/abi/marketplace";
import { tokenAbi } from "@/contracts/abi/token";
import useError from "@/hooks/use-error";
import { addressToShortAddress, ipfsUriToHttp } from "@/lib/converters";
import { useWallets } from "@privy-io/react-auth";
import axios from "axios";
import {
  BadgeDollarSignIcon,
  FileDigitIcon,
  HashIcon,
  Loader2Icon,
  StoreIcon,
  UserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
} from "viem";
import { LoadingSection } from "../loading-section";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function TokenSection(props: { address: string; id: string }) {
  const { wallets } = useWallets();
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const [tokenUriData, setTokenUriData] = useState<
    { image: string; name: string } | undefined
  >();
  const [tokenOwner, setTokenOwner] = useState<Address | undefined>();
  const [tokenListing, setTokenListing] = useState<
    { listingId: bigint; price: bigint } | undefined
  >();

  async function loadTokenUriData() {
    try {
      console.log("Loading token URI data...");
      // Load the token URI
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const tokenUri = await publicClient.readContract({
        address: props.address as Address,
        abi: tokenAbi,
        functionName: "tokenURI",
        args: [BigInt(props.id)],
      });
      // Load the token URI data
      const { data } = await axios.get(ipfsUriToHttp(tokenUri));
      // Update the state
      setTokenUriData({
        image: ipfsUriToHttp(data.image),
        name: data.name,
      });
    } catch (error) {
      handleError(error, "Failed to load the token data, try again later");
    }
  }

  async function loadTokenOwner() {
    try {
      console.log("Loading token owner...");
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const tokenOwner = await publicClient.readContract({
        address: props.address as Address,
        abi: tokenAbi,
        functionName: "ownerOf",
        args: [BigInt(props.id)],
      });
      setTokenOwner(tokenOwner);
    } catch (error) {
      handleError(error, "Failed to load the token owner, try again later");
    }
  }

  async function loadTokenListing() {
    try {
      console.log("Loading token listing...");
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });
      const tokenListingId = await publicClient.readContract({
        address: chainConfig.contracts.marketplace,
        abi: marketplaceAbi,
        functionName: "tokenListings",
        args: [props.address as Address, BigInt(props.id)],
      });
      const tokenListing = await publicClient.readContract({
        address: chainConfig.contracts.marketplace,
        abi: marketplaceAbi,
        functionName: "listings",
        args: [tokenListingId],
      });
      setTokenListing({ listingId: tokenListingId, price: tokenListing[4] });
    } catch (error) {
      handleError(error, "Failed to load the token listing, try again later");
    }
  }

  async function handleBuyToken() {
    try {
      console.log("Handling buy token...");
      setIsProsessing(true);

      if (!tokenListing) {
        throw new Error("Token listing not defined");
      }

      const wallet = wallets[0];
      if (!wallet) {
        toast.warning(`Please login`);
        return;
      }
      if (
        wallet.chainId.replace("eip155:", "") !==
        chainConfig.chain.id.toString()
      ) {
        toast.warning(`Please connect to ${chainConfig.chain.name}`);
        return;
      }

      const provider = await wallet.getEthereumProvider();
      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: custom(provider),
      });
      const walletClient = createWalletClient({
        account: wallet.address as Address,
        chain: chainConfig.chain,
        transport: custom(provider),
      });
      const { request } = await publicClient.simulateContract({
        account: wallet.address as Address,
        address: chainConfig.contracts.marketplace,
        abi: marketplaceAbi,
        functionName: "buy",
        args: [tokenListing.listingId],
        value: tokenListing.price,
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      loadTokenListing();

      toast("Token bought 🎉", {
        action: {
          label: "Transaction",
          onClick: () =>
            window.open(
              `${chainConfig.chain.blockExplorers?.default.url}/tx/${hash}`,
              "_blank"
            ),
        },
      });
    } catch (error) {
      handleError(error, "Failed to buy the token, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  useEffect(() => {
    loadTokenUriData();
    loadTokenOwner();
    loadTokenListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.address, props.id]);

  if (!tokenUriData || !tokenOwner || !tokenListing) {
    return <LoadingSection />;
  }

  return (
    <main className="container py-16 lg:px-80">
      {/* Token image */}
      <div className="lg:w-2/4">
        <Image
          src={tokenUriData.image}
          alt="Token Image"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      <p className="mt-4">{tokenUriData.name}</p>
      <Separator className="my-8" />
      <div className="flex flex-col gap-6">
        {/* Token address */}
        <div className="flex flex-rol gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary">
            <FileDigitIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token address</p>
            <Link
              href={`${chainConfig.chain.blockExplorers?.default.url}/token/${props.address}`}
              target="_blank"
            >
              <p className="text-sm underline underline-offset-4">
                {addressToShortAddress(props.address)}
              </p>
            </Link>
          </div>
        </div>
        {/* Token ID */}
        <div className="flex flex-rol gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary">
            <HashIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token ID</p>
            <p className="text-sm">#{props.id}</p>
          </div>
        </div>
        {/* Owner */}
        <div className="flex flex-rol gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary">
            <UserRoundIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Owner</p>
            <Link
              href={`${chainConfig.chain.blockExplorers?.default.url}/address/${tokenOwner}`}
              target="_blank"
            >
              <p className="text-sm underline underline-offset-4">
                {addressToShortAddress(tokenOwner)}
              </p>
            </Link>
          </div>
        </div>
        {/* Price */}
        <div className="flex flex-rol gap-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary">
            <BadgeDollarSignIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-sm">
              {tokenListing.price === BigInt(0)
                ? "NaN"
                : formatEther(tokenListing.price) +
                  " " +
                  chainConfig.chain.nativeCurrency.symbol}
            </p>
          </div>
        </div>
        {tokenListing.price !== BigInt(0) && (
          <Button
            // className="mt-8"
            disabled={isProsessing}
            onClick={() => handleBuyToken()}
          >
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <StoreIcon />
            )}
            Buy
          </Button>
        )}
      </div>
    </main>
  );
}
