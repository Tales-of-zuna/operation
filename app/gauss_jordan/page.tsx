"use client";
import { Divider, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";

const GaussJordan = () => {
  const [rows, setRows] = useState<any>(1);
  const [columns, setColumns] = useState<any>(1);
  const [matrix, setMatrix] = useState<string[][]>([[""]]);

  useEffect(() => {
    setMatrix(Array.from({ length: rows }, () => Array(columns).fill("")));
  }, [rows, columns]);

  const handleInputChange = (i: number, j: number, value: string) => {
    setMatrix((prev) => {
      const newMatrix = prev.map((row) => [...row]);
      newMatrix[i][j] = value;
      return newMatrix;
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100 text-xl">
      <div className="min-h-[50%] w-1/2 rounded-xl bg-white p-8 shadow-xl">
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
              <div className={`grid grid-cols-${columns} w-full gap-4`}>
                {matrix.map((row, i) =>
                  row.map((value, j) => (
                    <Input
                      key={`${i}-${j}`}
                      label={`A[${i}][${j}]`}
                      value={value}
                      className="col-span-1"
                      onChange={(e) => handleInputChange(i, j, e.target.value)}
                    />
                  )),
                )}
              </div>
            </div>
          </Tab>

          <Tab key="result" title="Хариу">
            <div>Тооцоолол энд гарна</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default GaussJordan;

// choloot ul medegdegch(allX-rang), undsen ul medegdegch (rang) mortei tentsuuleed hariu garahgui baival niitsgui
