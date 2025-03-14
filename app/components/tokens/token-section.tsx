import { chainConfig } from "@/config/chain";
import { tokenAbi } from "@/contracts/abi/token";
import useError from "@/hooks/use-error";
import { addressToShortAddress, ipfsUriToHttp } from "@/lib/converters";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Address, createPublicClient, http } from "viem";
import { LoadingSection } from "../loading-section";
import { Separator } from "../ui/separator";
import { FileDigitIcon, HashIcon } from "lucide-react";
import Link from "next/link";

export function TokenSection(props: { address: string; id: string }) {
  const { handleError } = useError();
  const [tokenUriData, setTokenUriData] = useState<
    { image: string; name: string } | undefined
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

  useEffect(() => {
    loadTokenUriData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.address, props.id]);

  if (!tokenUriData) {
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
      <div className="flex flex-col gap-4">
        {/* Token address */}
        <div className="flex flex-rol gap-2">
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
        <div className="flex flex-rol gap-2">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary">
            <HashIcon className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Token ID</p>
            <p className="text-sm">#{props.id}</p>
          </div>
        </div>
        {/* Post */}
        {/* TODO: */}
        {/* Price */}
        {/* TODO: */}
        {/* Buy button */}
        {/* TODO: */}
      </div>
    </main>
  );
}
