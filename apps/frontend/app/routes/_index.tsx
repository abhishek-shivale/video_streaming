import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <h1>
        Welcome to Remix!{" "}
        <Button className="bg-red-500"> hi there </Button>
      </h1>
    </>
  );
}
