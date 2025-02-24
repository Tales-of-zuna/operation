"use client";
import { Divider } from "@heroui/react";
import { useEffect, useState } from "react";
// 1. Гол элемент −ars –ийг урвуу хэмжигдэхүүн нь солино.
// 2. Ялгагч мөрийн бусад элементийг гол элементэд хуваана.
// 3. Ялгагч баганын бусад элементийг гол элементэд хувааж тэмдэгийг нь эсрэгээр өөрчилнө.
// 4. Ялгагч мөр баганын бус бусад элементүүд дараах томьёогоор хувирна. b[i][j]=(a[i][j]*a[r][s]−a[i][s]*a[r][j])/(−a[r][s])
const SecondMethod = ({ matrix, freeVariables }: any) => {
  const [transformedMatrix, setTransformedMatrix] = useState(matrix);
  const [transformationSteps, setTransformationSteps] = useState<number[][][]>(
    [],
  );
  const [xValues, setXValues] = useState<number[]>([]);

  const gaussJordanSecondMethod = (tmatrix: number[][]): number[][] => {
    let tempMatrix = tmatrix.map((row) => [...row]);
    let pivotColumns: Set<number> = new Set();
    let steps: number[][][] = [JSON.parse(JSON.stringify(tempMatrix))];

    for (let row = 0; row < tempMatrix.length; row++) {
      let pivotColumn = -1;
      for (let col = 0; col < tempMatrix[row].length; col++) {
        if (tempMatrix[row][col] !== 0 && !pivotColumns.has(col)) {
          pivotColumn = col;
          pivotColumns.add(col);
          break;
        }
      }

      if (pivotColumn === -1) continue;

      let pivotElement = tempMatrix[row][pivotColumn];

      tempMatrix[row][pivotColumn] = 1 / pivotElement;

      for (let col = 0; col < tempMatrix[row].length; col++) {
        if (col !== pivotColumn) {
          tempMatrix[row][col] = tempMatrix[row][col] / pivotElement;
        }
      }

      for (let i = 0; i < tempMatrix.length; i++) {
        if (i !== row) {
          tempMatrix[i][pivotColumn] =
            -tempMatrix[i][pivotColumn] / pivotElement;
        }
      }

      for (let i = 0; i < tempMatrix.length; i++) {
        if (i !== row) {
          for (let j = 0; j < tempMatrix[i].length; j++) {
            if (j !== pivotColumn) {
              tempMatrix[i][j] =
                (tempMatrix[i][j] * pivotElement -
                  tempMatrix[i][pivotColumn] *
                    tempMatrix[row][j] *
                    pivotElement) /
                pivotElement;
            }
          }
        }
      }

      steps.push(JSON.parse(JSON.stringify(tempMatrix)));
    }

    setTransformationSteps(steps);
    return tempMatrix;
  };

  const findXvalues = (matrix: number[][], freeVariables: number[]) => {
    let xValues: number[] = [];

    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        sum += matrix[i][j] * freeVariables[j];
      }
      xValues.push(sum);
    }

    return xValues;
  };

  useEffect(() => {
    if (!matrix || matrix.length === 0) return;

    const tempMatrix = matrix.map((row: number[]) => [...row]);
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        tempMatrix[i][j] *= -1;
      }
    }

    const result = gaussJordanSecondMethod(tempMatrix);
    setTransformedMatrix(result);
    const xValues = findXvalues(result, freeVariables);
    setXValues(xValues);
  }, [matrix, freeVariables]);

  return (
    <div className="space-y-4">
      <h3>Эх матриц</h3>
      <div className="p-4">
        {matrix &&
          matrix.map((row: number[], rowIndex: number) => (
            <div key={rowIndex} className="flex">
              {row.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className="flex h-10 w-10 items-center justify-center border"
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
      </div>

      <Divider />

      <h3>Хувиргалтын Алхмууд</h3>
      {transformationSteps.map((step, index) => (
        <div key={index}>
          <h4>Алхам {index}</h4>
          <div className="p-4">
            {step.map((row: number[], rowIndex: number) => (
              <div key={rowIndex} className="flex">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex h-10 w-10 items-center justify-center border"
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Divider />

      <div className="space-y-4 p-4">
        <h3>Үл мэдэгдэгч хувсагчид</h3>
        <div>
          {xValues.map((value, index) => (
            <div key={index}>
              x{index + 1}: {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondMethod;
