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
          Gauss Jordan
        </Button>
        <Button
          onPress={() => {
            router.push("/gauss_jordan");
          }}
        >
          ...
        </Button>
      </div>
    </div>
  );
};

export default Home;

// this is my gauss jordan calculation code. my professor told me to implement it this way
// 1. Гол элемент −𝑎𝑟𝑠 –ийг урвуу хэмжигдэхүүн нь солино.
// 2. Ялгагч мөрийн бусад элементийг гол элементэд хуваана.
// 3. Ялгагч баганын бусад элементийг гол элементэд хувааж
// тэмдэгийг нь эсрэгээр өөрчилнө.
// 4. Ялгагч мөр баганын бус бусад элементүүд дараах томьёогоор
// хувирна.
// 𝑏ij=(𝑎𝑖𝑗*𝑎𝑟𝑠−𝑎𝑖𝑠*𝑎𝑟𝑗)/(−𝑎𝑟𝑠)
// 1-р хүснэгтийг 2-р хүснэгтэд шилжүүлэх энэ хувиргалтыг
// Жорданы хялбарчилсан буюу 2-р хувиргалт гэнэ.
