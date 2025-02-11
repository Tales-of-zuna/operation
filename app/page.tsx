"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-4 items-center">
        <Button
          onPress={() => {
            router.push("/gauss_jordan");
          }}
        >
          Gauss Jordan
        </Button>
      </div>
    </div>
  );
};

export default Home;
