"use client";
import GaussJordanCalculation from "@/components/gauss_jordan/calculation";
import SecondMethod from "@/components/gauss_jordan/secondMethod";
import { Divider, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";

const GaussJordan = () => {
  const [rows, setRows] = useState<number | "">("");
  const [columns, setColumns] = useState<number | "">("");
  const [matrix, setMatrix] = useState<(string | number)[][]>([[]]);
  const [freeVariables, setFreeVariables] = useState<(string | number)[][]>([]);

  useEffect(() => {
    if (rows && columns) {
      setMatrix(Array.from({ length: rows }, () => Array(columns).fill("")));
    }
  }, [rows, columns]);

  const handleInputChange = (i: number, j: number, value: string) => {
    setMatrix((prev) => {
      const newMatrix = prev.map((row) => [...row]);
      if (value === "-" || value === "" || !isNaN(Number(value))) {
        newMatrix[i][j] = value;
      }
      return newMatrix;
    });
  };

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
  ) => {
    if (value === "" || /^\d+$/.test(value)) {
      setter(value === "" ? "" : parseInt(value, 10));
    }
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
                  value={rows.toString()}
                  onChange={(e) => handleNumberInput(e.target.value, setRows)}
                />
                <Input
                  label="Баганын тоо"
                  value={columns.toString()}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setColumns)
                  }
                />
              </div>

              <Divider />
              <div className="flex items-center justify-center space-x-4">
                {rows && columns ? (
                  <div className="space-y-4">
                    {Array.from({ length: rows }, (_, i) => (
                      <Input
                        key={i}
                        label={`Сул гишүүн ${i + 1}`}
                        value={freeVariables[i]?.toString() || ""}
                        onChange={(e) => {
                          const newFreeVariables = [...freeVariables];
                          newFreeVariables[i] = [e.target.value];
                          setFreeVariables(newFreeVariables);
                        }}
                      />
                    ))}
                  </div>
                ) : null}
                {rows && columns ? (
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
                          value={value.toString()}
                          className="col-span-1"
                          onChange={(e) =>
                            handleInputChange(i, j, e.target.value)
                          }
                        />
                      )),
                    )}
                  </div>
                ) : (
                  <p className="text-center text-neutral-400">
                    Мөр, баганын тоог оруулна уу.
                  </p>
                )}
              </div>
              <Divider />

              <div className="flex flex-col items-center justify-center space-y-2">
                <p>Тооцоолол хийгдэх хүснэгт:</p>
                <pre className="text-sm text-green-500">
                  {JSON.stringify(matrix)}
                </pre>
                <p>Сул гишүүд:</p>
                <pre className="text-sm text-green-500">
                  {JSON.stringify(freeVariables)}
                </pre>
              </div>
            </div>
          </Tab>
          ``
          <Tab key="result" title="Хариу">
            <GaussJordanCalculation matrix={matrix} />
          </Tab>
          <Tab key="secondMethod" title="Хариу( 2-р хувиргалт )">
            <SecondMethod matrix={matrix} freeVariables={freeVariables} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default GaussJordan;
