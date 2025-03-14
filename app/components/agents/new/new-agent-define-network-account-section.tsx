"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CrosshairIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function NewAgentDefineNetworkAccountSection(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);

  const networks = [
    { id: "WARPCAST", title: "Warpcast", disabled: false },
    { id: "X", title: "X", disabled: true },
    { id: "INSTAGRAM", title: "Instagram", disabled: true },
  ];

  const formSchema = z.object({
    network: z.string().min(3),
    account: z.string().min(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      network: "",
      account: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        network: values.network,
        account: values.account,
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
        <CrosshairIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Step #2
      </h1>
      <p className="text-muted-foreground mt-1">
        Who will be the target of the agent&apos;s gags?
      </p>
      <Separator className="my-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social network *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a social network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {networks.map((network, index) => (
                      <SelectItem
                        key={index}
                        value={network.id}
                        disabled={network.disabled}
                      >
                        {network.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="alice"
                    disabled={isProsessing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" disabled={isProsessing}>
            {isProsessing ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowRightIcon />
            )}
            Next step
          </Button>
        </form>
      </Form>
    </main>
  );
}
