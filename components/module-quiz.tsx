"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/icons";
import type { FollowUpCourse } from "@/data/follow-up-courses";
import type { ModuleQuiz, QuizQuestion } from "@/types/quiz";

type PreparedQuestion = QuizQuestion & { shuffledChoices: string[] };

function formatReviewDate(value?: string) {
  if (!value) return "Review date unavailable";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
type AnswerRecord = { question: PreparedQuestion; selected: string };
type StoredResult = { bestScore: number; attempts: number; passed: boolean; completedAt?: string };

type ModuleQuizProps = {
  quiz: ModuleQuiz;
  recommendations: FollowUpCourse[];
  moduleTitle: string;
  lessonHref: string;
  continuationHref: string;
  continuationLabel: string;
};

const resultsKey = "nest-module-quiz-results-v1";
const completionKey = "nest-module-completions-v1";

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function prepareQuestions(questions: QuizQuestion[]) {
  return shuffle(questions).map((question) => ({ ...question, shuffledChoices: shuffle(question.choices) }));
}

function readResults() {
  try {
    const value = JSON.parse(window.localStorage.getItem(resultsKey) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, result]) => {
      if (!result || typeof result !== "object" || Array.isArray(result)) return false;
      const item = result as Partial<StoredResult>;
      return Number.isSafeInteger(item.bestScore) && Number(item.bestScore) >= 0
        && Number.isSafeInteger(item.attempts) && Number(item.attempts) >= 1
        && typeof item.passed === "boolean"
        && (item.completedAt === undefined || (typeof item.completedAt === "string" && Number.isFinite(Date.parse(item.completedAt))));
    })) as Record<string, StoredResult>;
  } catch {
    return {};
  }
}

function readCompletions() {
  try {
    const value = JSON.parse(window.localStorage.getItem(completionKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function ModuleQuizRunner({ quiz, recommendations, moduleTitle, lessonHref, continuationHref, continuationLabel }: ModuleQuizProps) {
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [previousResult, setPreviousResult] = useState<StoredResult>();
  const [progressSaved, setProgressSaved] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const result = readResults()[quiz.id];
      setPreviousResult(result && result.bestScore <= quiz.questions.length ? result : undefined);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [quiz.id, quiz.questions.length]);

  useEffect(() => {
    if (phase !== "intro") headingRef.current?.focus();
  }, [phase, questionIndex]);

  const current = questions[questionIndex];
  const score = answers.filter((answer) => answer.selected === answer.question.correctAnswer).length;
  const passed = score >= quiz.passingScore;

  function startQuiz() {
    setQuestions(prepareQuestions(quiz.questions));
    setQuestionIndex(0);
    setSelected(undefined);
    setAnswers([]);
    setProgressSaved(true);
    setPhase("quiz");
  }

  function selectAnswer(answer: string) {
    if (!current || selected) return;
    setSelected(answer);
    setAnswers((existing) => [...existing, { question: current, selected: answer }]);
  }

  function advance() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelected(undefined);
      return;
    }

    const finalScore = answers.filter((answer) => answer.selected === answer.question.correctAnswer).length;
    const didPass = finalScore >= quiz.passingScore;
    const existingResults = readResults();
    const storedResult = existingResults[quiz.id];
    const oldResult = storedResult && storedResult.bestScore <= quiz.questions.length ? storedResult : previousResult;
    const nextResult: StoredResult = {
      bestScore: Math.max(oldResult?.bestScore ?? 0, finalScore),
      attempts: (oldResult?.attempts ?? 0) + 1,
      passed: Boolean(oldResult?.passed || didPass),
      completedAt: didPass ? new Date().toISOString() : oldResult?.completedAt,
    };
    try {
      window.localStorage.setItem(resultsKey, JSON.stringify({ ...existingResults, [quiz.id]: nextResult }));
      if (didPass) {
        const completions = readCompletions();
        if (!completions.includes(quiz.id)) window.localStorage.setItem(completionKey, JSON.stringify([...completions, quiz.id]));
      }
      setProgressSaved(true);
    } catch {
      setProgressSaved(false);
    }
    setPreviousResult(nextResult);
    setPhase("results");
  }

  if (phase === "intro") {
    return <section className="quiz-panel quiz-intro" aria-labelledby="quiz-title">
      <div className="quiz-verification-seal" role="note"><CheckIcon /><span><strong>Sources checked</strong><small>Reviewed {formatReviewDate(quiz.questions[0]?.source.reviewedOn)}</small></span></div>
      <p className="eyebrow">Module checkpoint</p>
      <h1 id="quiz-title">{quiz.title}</h1>
      <p>{quiz.introduction}</p>
      <div className="quiz-facts"><span><strong>{quiz.questions.length}</strong> questions</span><span><strong>{quiz.passingScore}</strong> correct to pass</span><span><strong>Unlimited</strong> retries</span></div>
      {previousResult ? <p className="quiz-previous">Previous best: <strong>{previousResult.bestScore}/{quiz.questions.length}</strong> across {previousResult.attempts} {previousResult.attempts === 1 ? "attempt" : "attempts"}.</p> : null}
      <div className="quiz-actions"><button type="button" className="button button--primary" onClick={startQuiz}>{previousResult ? "Try checkpoint again" : "Start checkpoint"}<ArrowRightIcon /></button><Link href={lessonHref} className="button button--secondary"><ArrowLeftIcon />Return to lesson</Link></div>
    </section>;
  }

  if (phase === "quiz" && current) {
    const isCorrect = selected === current.correctAnswer;
    return <section className="quiz-panel" aria-labelledby="question-title">
      <div className="quiz-progress-row"><span>Question {questionIndex + 1} of {questions.length}</span><span>{answers.filter((answer) => answer.selected === answer.question.correctAnswer).length} correct</span></div>
      <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
      <div className="quiz-question"><p className="eyebrow">Choose one answer</p><h1 id="question-title" ref={headingRef} tabIndex={-1}>{current.prompt}</h1>
        <div className="quiz-choices">{current.shuffledChoices.map((choice, index) => {
          const state = selected ? choice === current.correctAnswer ? "correct" : choice === selected ? "incorrect" : "muted" : "";
          return <button type="button" className={`quiz-choice ${state}`} onClick={() => selectAnswer(choice)} disabled={Boolean(selected)} key={choice}><span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong></button>;
        })}</div>
        {selected ? <div className={`quiz-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status"><div>{isCorrect ? <CheckIcon /> : <CloseIcon />}<strong>{isCorrect ? "Correct" : `Correct answer: ${current.correctAnswer}`}</strong></div><p>{current.explanation}</p><a href={current.source.href} target="_blank" rel="noopener noreferrer">Source: {current.source.publisher}, {current.source.section} <ArrowRightIcon /></a></div> : null}
        {selected ? <div className="quiz-actions"><button type="button" className="button button--primary" onClick={advance}>{questionIndex === questions.length - 1 ? "View results" : "Next question"}<ArrowRightIcon /></button></div> : null}
      </div>
    </section>;
  }

  return <section className="quiz-panel quiz-results" aria-labelledby="results-title">
    <div className={`quiz-result-mark ${passed ? "passed" : "retry"}`}><strong>{score}/{quiz.questions.length}</strong><span>{passed ? "Passed" : "Review"}</span></div>
    <p className="eyebrow">Checkpoint complete</p>
    <h1 id="results-title" ref={headingRef} tabIndex={-1}>{passed ? `${moduleTitle} completed` : "One more attempt will help"}</h1>
    <p>{passed ? `You passed this checkpoint.${progressSaved ? " Your result is saved in this browser." : ""} You can now explore independent certificate courses or continue learning.` : `You need ${quiz.passingScore} correct answers to pass. Review the sourced explanations below and retry when ready.`}</p>
    {!progressSaved ? <p className="quiz-storage-notice" role="status">Your result is available here, but your browser could not save all of your progress. It may be lost when you refresh or leave this page.</p> : null}
    <details className="quiz-review"><summary>Review all answers</summary><div>{answers.map((answer, index) => <article key={answer.question.id}><span className={answer.selected === answer.question.correctAnswer ? "correct" : "incorrect"}>{index + 1}</span><div><h2>{answer.question.prompt}</h2><p>Your answer: <strong>{answer.selected}</strong></p><p>{answer.question.explanation}</p><a href={answer.question.source.href} target="_blank" rel="noopener noreferrer">{answer.question.source.title} · {answer.question.source.section}</a></div></article>)}</div></details>
    {passed ? <section className="checkpoint-recommendations" aria-labelledby="recommendations-title"><div><p className="eyebrow">Continue with a certificate</p><h2 id="recommendations-title">University courses for your next step</h2><p>NEST does not issue a certificate for this checkpoint. These independent courses provide their own free or paid credential routes.</p></div><div className="course-recommendations__list">{recommendations.map((course) => <article className="course-recommendation" key={course.id}><div className="course-recommendation__top"><span className={`course-access course-access--${course.access === "Free certificate" ? "free" : course.access === "Free access, paid certificate" ? "mixed" : "paid"}`}>{course.access}</span><small>Verified {course.verifiedOn}</small></div><p className="eyebrow">{course.university} · {course.platform}</p><h3>{course.title}</h3><p>{course.fit}</p><details className="course-registration"><summary>How to register</summary><p>{course.registration}</p>{course.financialAid ? <span><CheckIcon /> Financial aid may be available</span> : null}</details><a href={course.href} target="_blank" rel="noopener noreferrer" className="button button--secondary">View official course <ArrowRightIcon /></a></article>)}</div><p className="checkpoint-disclaimer">Availability, prices, eligibility, and certificate terms are controlled by each university or platform and may change.</p></section> : null}
    <div className="quiz-actions"><button type="button" className="button button--secondary" onClick={startQuiz}>Retry checkpoint</button>{passed ? <Link href={continuationHref} className="button button--primary">{continuationLabel}<ArrowRightIcon /></Link> : <Link href={lessonHref} className="button button--secondary"><ArrowLeftIcon />Review final lesson</Link>}</div>
  </section>;
}
