"use client";
import GaussJordanCalculation from "@/components/gauss_jordan/calculation";
import { Divider, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";

const GaussJordan = () => {
  const [rows, setRows] = useState<any>(1);
  const [columns, setColumns] = useState<any>(1);
  const [matrix, setMatrix] = useState<number[][]>([[1]]);

  useEffect(() => {
    setMatrix(Array.from({ length: rows }, () => Array(columns).fill("")));
  }, [rows, columns]);

  const handleInputChange = (i: number, j: number, value: string) => {
    setMatrix((prev) => {
      const newMatrix = prev.map((row) => [...row]);
      newMatrix[i][j] = Number(value);
      return newMatrix;
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center text-xl">
      <div className="min-h-[600px] w-1/2 rounded-xl bg-neutral-900 p-8 shadow-xl">
        <Tabs>
          <Tab key="entry" title="Өгөгдөл оруулах">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Input
                  label="Мөрийн тоо"
                  placeholder="1"
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                />
                <Input
                  label="Баганын тоо"
                  placeholder="1"
                  value={columns}
                  onChange={(e) => setColumns(Number(e.target.value))}
                />
              </div>
              <Divider />
              <div
                className="grid w-full gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(50px, 1fr))`,
                }}
              >
                {matrix.map((row, i) =>
                  row.map((value, j) => (
                    <Input
                      key={`${i}-${j}`}
                      label={`A[${i}][${j}]`}
                      value={Number(value).toString()}
                      className="col-span-1"
                      onChange={(e) => handleInputChange(i, j, e.target.value)}
                    />
                  )),
                )}
              </div>
              <Divider />
              <div className="flex flex-col items-center justify-center space-y-2">
                <p>Тооцоолол хийгдэх хүснэгт</p>
                <p>{JSON.stringify(matrix)}</p>
              </div>
            </div>
          </Tab>

          <Tab key="result" title="Хариу">
            <div>Тооцоолол энд гарна</div>
            <div className="">
              <GaussJordanCalculation matrix={matrix} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default GaussJordan;

// choloot ul medegdegch(allX-rang), undsen ul medegdegch (rang) mortei tentsuuleed hariu garahgui baival niitsgui
