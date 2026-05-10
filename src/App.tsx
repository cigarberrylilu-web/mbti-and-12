/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ResultPage } from "./components/ResultPage";
import { LoadingPage } from "./components/LoadingPage";

export default function App() {
  const [data, setData] = useState<{ mbti: string; zodiac: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // In this static mock we force everything to go to the result page with the static content,
  // but we still capture what the user picked.
  const handleComplete = (selection: { mbti: string; zodiac: string }) => {
    setData(selection);
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleBack = () => {
    setData(null);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onComplete={handleLoadingComplete} />;
  }

  if (data) {
    return <ResultPage data={data} onBack={handleBack} />;
  }

  return <HomePage onComplete={handleComplete} />;
}


