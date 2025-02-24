"use client";
import { useEffect, useState } from "react";

const SecondMethod = ({ matrix, freeVariables }: any) => {
  const [transformedMatrix, setTransformedMatrix] = useState(matrix);
  const [transformationSteps, setTransformationSteps] = useState<number[][][]>(
    [],
  );

  const gaussJordanSecondMethod = (tmatrix: number[][]): number[][] => {
    let tempMatrix = tmatrix.map((row) => [...row]);
    let pivotColumns: Set<number> = new Set();
    let steps: number[][][] = [tempMatrix.map((row) => [...row])]; // Эхний матрицын төлөв хадгалах

    for (let row = 0; row < tempMatrix.length; row++) {
      // 0. Тэгээс ялгаатай гол элемент сонгох. Хэрэв 0 байвал тухайн мөрийн дараагийн баганын утгыг шалгах
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

      // 1. Гол элемент −𝑎𝑟𝑠 –ийг урвуу хэмжигдэхүүн нь солино.
      tempMatrix[row][pivotColumn] = 1 / pivotElement;
      for (let col = 0; col < tempMatrix[row].length; col++) {
        if (col !== pivotColumn) {
          // 2. Ялгагч мөрийн бусад элементийг гол элементэд хуваана.
          tempMatrix[row][col] /= pivotElement;
        }
      }

      for (let i = 0; i < tempMatrix.length; i++) {
        if (i === row) continue;

        let factor = tempMatrix[i][pivotColumn];
        // 3. Ялгагч баганын бусад элементийг хувиргах
        tempMatrix[i][pivotColumn] = -factor / pivotElement;

        for (let j = 0; j < tempMatrix[i].length; j++) {
          if (j !== pivotColumn) {
            // 4. Ялгагч мөр баганын бус бусад элементүүд дараах томьёогоор хувирна. 𝑏ij=(𝑎𝑖𝑗*𝑎𝑟𝑠−𝑎𝑖𝑠*𝑎𝑟𝑗)/(−𝑎𝑟𝑠)
            tempMatrix[i][j] =
              (tempMatrix[i][j] * pivotElement - tempMatrix[row][j] * factor) /
              -pivotElement;
          }
        }
      }
      steps.push(tempMatrix.map((row) => [...row])); // Алхам хадгалах
    }

    console.log(pivotColumns);
    setTransformationSteps(steps); // Бүх хувиргалтын алхмуудыг хадгалах
    return tempMatrix;
  };

  const findXvalues = (matrix: number[][], freeVariables: number[]) => {};

  useEffect(() => {
    const tempMatrix = matrix.map((row: any) => [...row]);
    // Матрицын бүх элементүүдийг -1 үржүүлэх
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        tempMatrix[i][j] *= -1;
      }
    }
    setTransformedMatrix(gaussJordanSecondMethod(tempMatrix));
    // findXvalues(transformedMatrix, freeVariables);
  }, [matrix, freeVariables]);

  return (
    <div>
      <h3>Эх матриц</h3>
      <div
        style={{
          display: "inline-block",
          padding: "10px",
        }}
      >
        {matrix.map((row: number[], rowIndex: number) => (
          <div
            key={rowIndex}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                style={{ margin: "5px", minWidth: "30px", textAlign: "center" }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3>Хувиргалтын Алхмууд</h3>
      {transformationSteps.map((step, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <h4>Алхам {index + 1}</h4>
          <div
            style={{
              display: "inline-block",
              padding: "10px",
            }}
          >
            {step.map((row: number[], rowIndex: number) => (
              <div
                key={rowIndex}
                style={{ display: "flex", justifyContent: "center" }}
              >
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      margin: "5px",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <h3>Эцсийн Хувиргасан Матриц</h3>
      <div
        style={{
          display: "inline-block",
          padding: "10px",
        }}
      >
        {transformedMatrix.map((row: number[], rowIndex: number) => (
          <div
            key={rowIndex}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                style={{ margin: "5px", minWidth: "30px", textAlign: "center" }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondMethod;
