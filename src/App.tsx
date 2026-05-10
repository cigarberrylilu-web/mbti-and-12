/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ResultPage } from "./components/ResultPage";

export default function App() {
  const [data, setData] = useState<{ mbti: string; zodiac: string } | null>(null);

  // In this static mock we force everything to go to the result page with the static content,
  // but we still capture what the user picked.
  const handleComplete = (selection: { mbti: string; zodiac: string }) => {
    setData(selection);
  };

  const handleBack = () => {
    setData(null);
  };

  if (data) {
    return <ResultPage data={data} onBack={handleBack} />;
  }

  return <HomePage onComplete={handleComplete} />;
}

