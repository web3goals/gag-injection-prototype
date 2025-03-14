"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { DramaIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function NewAgentDefineStyleSection(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const styles = [
    {
      id: "KIND_SWEET",
      image: "/images/style-kind-sweet.png",
      title: "Kind & Sweet",
      description:
        "Spreading positivity, compliments, and warm vibes across the internet. A little kindness goes a long way!",
    },
    {
      id: "PROVOCATIVE_SARCASTIC",
      image: "/images/style-provocative-sarcastic.png",
      title: "Provocative & Sarcastic",
      description:
        "Witty, bold, and not afraid to stir the pot. Expect sharp comebacks, playful jabs, and spicy takes! ",
    },
  ];

  async function handleSubmit(style: string) {
    try {
      setIsProsessing(true);
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        style: style,
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="container py-16 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <DramaIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Step #1
      </h1>
      <p className="text-muted-foreground mt-1">
        What style of gags should an agent follow?
      </p>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        {styles.map((style, index) => (
          <div
            key={index}
            className="w-full flex flex-row gap-6 border rounded px-6 py-6"
          >
            <div className="w-64">
              <Image
                src={style.image}
                alt="Style Image"
                priority={false}
                width="100"
                height="100"
                sizes="100vw"
                className="w-full rounded-xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-xl font-extrabold">{style.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {style.description}
              </p>
              <Button
                className="mt-4"
                disabled={isProsessing}
                onClick={() => handleSubmit(style.id)}
              >
                <MoveRightIcon /> Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
