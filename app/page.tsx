"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-4">
        <Button
          onPress={() => {
            router.push("/gauss_jordan");
          }}
        >
          Гаусс Жордан
        </Button>
        <Button
          onPress={() => {
            router.push("/transportationNew");
          }}
        >
          Тээврийн бодлого (Зүүн дээд)
        </Button>
        <Button
          onPress={() => {
            router.push("/transportation");
          }}
        >
          Тээврийн бодлого (Вогел)
        </Button>
      </div>
    </div>
  );
};

export default Home;
