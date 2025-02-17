"use client";

import { useEffect, useState } from "react";

const GaussJordanCalculation = ({ matrix }: { matrix: number[][] }) => {
  const [result, setResult] = useState<number[][]>([]);
  const [solutions, setSolutions] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Gauss-Jordan Elimination for RREF
  const gaussJordanElimination = (matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let a = matrix.map((row) => [...row]); // Deep copy

    for (let pivotRow = 0; pivotRow < rows; pivotRow++) {
      // Step 1: Find Pivot
      let pivot = a[pivotRow][pivotRow];
      if (pivot === 0) {
        // Attempt row swap if pivot is zero
        let swapRow = pivotRow + 1;
        while (swapRow < rows && a[swapRow][pivotRow] === 0) {
          swapRow++;
        }
        if (swapRow === rows) continue; // No non-zero pivot, skip column
        [a[pivotRow], a[swapRow]] = [a[swapRow], a[pivotRow]];
        pivot = a[pivotRow][pivotRow];
      }

      // Step 2: Normalize Pivot Row
      for (let col = 0; col < cols; col++) {
        a[pivotRow][col] /= pivot;
      }

      // Step 3: Eliminate Other Rows
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

  // Extract solution from RREF matrix
  const extractSolutions = (rref: number[][]): number[] | string => {
    const rows = rref.length;
    const cols = rref[0].length;
    const solutions: number[] = new Array(rows).fill(0);

    for (let i = 0; i < rows; i++) {
      // If pivot column doesn't match row, infinite solutions or no solution
      let pivotCol = rref[i].findIndex((val) => val === 1);
      if (pivotCol === -1) continue; // No pivot in this row (free variable)

      if (pivotCol === cols - 1) {
        // Last column pivot means no solution
        return "No Solution (Inconsistent system)";
      }

      solutions[pivotCol] = rref[i][cols - 1]; // Store solution
    }

    return solutions;
  };

  useEffect(() => {
    try {
      const rref = gaussJordanElimination(matrix);
      setResult(rref);

      const solutionResult = extractSolutions(rref);
      if (typeof solutionResult === "string") {
        setError(solutionResult);
        setSolutions(null);
      } else {
        setError(null);
        setSolutions(solutionResult);
      }
    } catch (err) {
      setError("An error occurred during calculation.");
    }
  }, [matrix]);

  return (
    <div>
      <h3>Gauss–Jordan Elimination Result (RREF):</h3>
      <pre>{JSON.stringify(result)}</pre>

      {error ? (
        <div style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        solutions && (
          <div>
            <h4>Solutions (x-values):</h4>
            {solutions.map((sol, idx) => (
              <div key={idx}>
                x<sub>{idx + 1}</sub> = {sol.toFixed(4)}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default GaussJordanCalculation;
