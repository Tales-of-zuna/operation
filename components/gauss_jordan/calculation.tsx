"use client";

import { useEffect, useState } from "react";

const GaussJordanCalculation = ({ matrix }: any) => {
  const [rrefMatrix, setRrefMatrix] = useState<any[][]>([]);
  const [solutions, setSolutions] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gaussJordanElimination = (matrix: any[][]): any[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const a = matrix.map((row) => [...row]);

    for (let pivotRow = 0; pivotRow < rows; pivotRow++) {
      let pivot = a[pivotRow][pivotRow];
      if (pivot === 0) {
        let swapRow = pivotRow + 1;
        while (swapRow < rows && a[swapRow][pivotRow] === 0) {
          swapRow++;
        }
        if (swapRow === rows) continue;
        [a[pivotRow], a[swapRow]] = [a[swapRow], a[pivotRow]];
        pivot = a[pivotRow][pivotRow];
      }

      if (pivot !== 0) {
        for (let col = 0; col < cols; col++) {
          a[pivotRow][col] /= pivot;
        }
      }

      for (let row = 0; row < rows; row++) {
        if (row === pivotRow) continue;
        const factor = a[row][pivotRow];
        for (let col = 0; col < cols; col++) {
          a[row][col] -= factor * a[pivotRow][col];
        }
      }
    }
    return a;
  };

  const extractSolutions = (rref: any[][]): any[] | string => {
    const rows = rref.length;
    const cols = rref[0].length;
    const solutions: any[] = Array(rows).fill(0);

    for (let i = 0; i < rows; i++) {
      const pivotCol = rref[i].findIndex((val) => Math.abs(val - 1) < 1e-10);
      if (pivotCol === -1) continue;

      if (pivotCol === cols - 1) {
        return "Нийцгүй систем";
      }

      solutions[pivotCol] = rref[i][cols - 1];
    }

    return solutions;
  };

  const renderMatrix = (matrix: any[][]) => (
    <table style={{ borderCollapse: "collapse", margin: "1rem 0" }}>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((val, j) => (
              <td
                key={j}
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  useEffect(() => {
    try {
      if (
        matrix.length === 0 ||
        matrix.some((row: any) => row.length !== matrix[0].length)
      ) {
        throw new Error("Матриц буруу бүтэцтэй байна.");
      }

      const rref = gaussJordanElimination(matrix);
      setRrefMatrix(rref);

      const solutionResult = extractSolutions(rref);
      if (typeof solutionResult === "string") {
        setError(solutionResult);
        setSolutions(null);
      } else {
        setError(null);
        setSolutions(solutionResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
      setSolutions(null);
    }
  }, [matrix]);

  return (
    <div className="space-y-8">
      <h3>Гаусс Жорданы хувиргалт</h3>

      <h4>Хувиргалтын эцсийн матриц:</h4>
      {rrefMatrix.length > 0 ? (
        renderMatrix(rrefMatrix)
      ) : (
        <p>Шийдэл олдсонгүй.</p>
      )}

      {error ? (
        <div style={{ color: "red", fontWeight: "bold" }}>Алдаа: {error}</div>
      ) : solutions ? (
        <div>
          <h4>Үл мэдэгдэгчийн утгууд (X):</h4>
          {solutions.map((sol, idx) => (
            <div key={idx}>
              x<sub>{idx + 1}</sub> = {sol.toFixed(4)}
            </div>
          ))}
        </div>
      ) : (
        <p>Шийдэл олдсонгүй.</p>
      )}
    </div>
  );
};

export default GaussJordanCalculation;
