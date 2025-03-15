"use client";

import { chainConfig } from "@/config/chain";
import { warpcastConfig } from "@/config/warpcast";
import { marketplaceAbi } from "@/contracts/abi/marketplace";
import useError from "@/hooks/use-error";
import { addressToShortAddress } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import axios from "axios";
import {
  CalendarIcon,
  CircleOffIcon,
  DramaIcon,
  FileDigitIcon,
  GlobeIcon,
  Loader2Icon,
  UserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPublicClient, formatEther, http } from "viem";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function AgentCard(props: { agent: Agent; onAgentUpdate: () => void }) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const [tokenSales, setTokenSales] = useState<
    Map<bigint, bigint> | undefined
  >();

  const styleImages = {
    KIND_SWEET: "/images/style-kind-sweet.png",
    PROVOCATIVE_SARCASTIC: "/images/style-provocative-sarcastic.png",
  };
  const styleStrings = {
    KIND_SWEET: "Kind & Sweet",
    PROVOCATIVE_SARCASTIC: "Provocative & Sarcastic",
  };
  const networkStrings = {
    WARPCAST: "Warpcast",
  };

  async function loadTokenSales() {
    try {
      console.log("Loading sales...");

      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });

      const latestBlock = await publicClient.getBlockNumber();
      const fromBlock = BigInt(chainConfig.contracts.marketplaceCreationgBlock);
      let currentBlock = fromBlock;
      const tokenSales = new Map<bigint, bigint>();

      while (currentBlock <= latestBlock) {
        const toBlock = BigInt(
          Math.min(Number(currentBlock) + 9999, Number(latestBlock))
        );
        const events = await publicClient.getContractEvents({
          address: chainConfig.contracts.marketplace,
          abi: marketplaceAbi,
          eventName: "Sold",
          fromBlock: currentBlock,
          toBlock: toBlock,
          args: {
            seller: chainConfig.accounts.agent,
            tokenContract: props.agent.tokenAddress,
          },
        });
        for (const event of events) {
          if (
            event.args.tokenId !== undefined &&
            event.args.price !== undefined
          ) {
            tokenSales.set(event.args.tokenId, event.args.price);
          }
        }
        currentBlock = toBlock + BigInt(1);
      }

      setTokenSales(tokenSales);
    } catch (error) {
      handleError(error, "Failed to load token sales, try again later");
    }
  }

  async function handleFireAgent() {
    try {
      console.log("Handling fire agent...");
      setIsProsessing(true);
      await axios.post("/api/agents/firing", {
        id: props.agent._id?.toString(),
      });
      props.onAgentUpdate();
      toast("Agent fired 🎉");
    } catch (error) {
      handleError(error, "Failed to fire the agent, try again later");
    }
  }

  useEffect(() => {
    loadTokenSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.agent]);

  return (
    <div className="w-full flex flex-row gap-6 border rounded px-6 py-6">
      {/* Image */}
      <div className="w-24">
        <Image
          src={styleImages[props.agent.style]}
          alt="Style Image"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      <div className="flex-1">
        {/* ID */}
        <p className="text-xl font-extrabold">
          Agent #{props.agent._id?.toString().slice(-6).toUpperCase()}
        </p>
        <div className="flex flex-col gap-4 mt-4">
          {/* Created */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary">
              <CalendarIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">
                {new Date(props.agent.createdDate).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Style */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary">
              <DramaIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Style</p>
              <p className="text-sm">{styleStrings[props.agent.style]}</p>
            </div>
          </div>
          {/* Network */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary">
              <GlobeIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Social network</p>
              <p className="text-sm">{networkStrings[props.agent.network]}</p>
            </div>
          </div>
          {/* Account */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary">
              <UserRoundIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Account</p>
              <Link
                href={`https://warpcast.com/${props.agent.account}`}
                target="_blank"
              >
                <p className="text-sm underline underline-offset-4">
                  {props.agent.account}
                </p>
              </Link>
            </div>
          </div>
          {/* Token */}
          <div className="flex flex-row gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary">
              <FileDigitIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Token address</p>
              <Link
                href={`${chainConfig.chain.blockExplorers?.default.url}/token/${props.agent.tokenAddress}`}
                target="_blank"
              >
                <p className="text-sm underline underline-offset-4">
                  {addressToShortAddress(props.agent.tokenAddress)}
                </p>
              </Link>
            </div>
          </div>
        </div>
        {/* Activity */}
        <p className="text-xl font-extrabold mt-12">Agent activity</p>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Token</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Sale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.agent.posts.map((post, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Link
                    href={`/tokens/${props.agent.tokenAddress}/${post.token}`}
                    target="_blank"
                  >
                    <p className="underline underline-offset-4">
                      #{post.token}
                    </p>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://warpcast.com/${warpcastConfig.username}/${post.hash}`}
                    target="_blank"
                  >
                    <p className="underline underline-offset-4">
                      {post.hash.slice(0, 10)}
                    </p>
                  </Link>
                  <p className="text-muted-foreground mt-2">
                    {new Date(post.createdDate).toLocaleString()}
                  </p>
                </TableCell>
                <TableCell>
                  {tokenSales ? (
                    <>
                      {tokenSales.has(BigInt(post.token))
                        ? formatEther(
                            tokenSales.get(BigInt(post.token)) as bigint
                          ) +
                          " " +
                          chainConfig.chain.nativeCurrency.symbol
                        : "NaN"}
                    </>
                  ) : (
                    <Skeleton className="h-10" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Fire button */}
        <Button
          variant="destructive"
          disabled={isProsessing}
          onClick={() => handleFireAgent()}
          className="mt-12"
        >
          {isProsessing ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <CircleOffIcon />
          )}
          Fire agent
        </Button>
      </div>
    </div>
  );
}
