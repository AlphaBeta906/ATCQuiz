import React from "react";

import { useEffect, useState, useRef } from "react"
import { questions } from "./questions.tsx";
import { Question } from "@/types/question";

function toProperCase(text: string) {
    return text.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(); });
};

function difficulty(text: "easy" | "medium" | "hard" | "cursed") {
    switch (text) {
        case "easy":
            return <span className="text-lime-500">Easy</span>
        case "medium":
            return <span className="text-amber-500">Medium</span>
        case "hard":
            return <span className="text-red-500">Hard</span>
        case "cursed":
            return <span className="text-red-800">C U R S E D</span>
        default:
            return <span className="text-gray-500">???</span>
    }
}

function genPoints(answer: boolean, truth: "pants on fire" | "false" | "mostly false" | "mostly true" | "true", difficulty: "easy" | "medium" | "hard" | "cursed") {
    let bonus = 0

    if (difficulty === "hard") {
        bonus = 0.5
    } else if (difficulty === "cursed") {
        bonus = 2
    }

    if (answer === true) {
        switch (truth) {
            case "pants on fire":
                return 0;
            case "false":
                return 0;
            case "mostly false":
                return 0.5 + Math.floor(bonus/2);
            case "mostly true":
                return 1 + bonus;
            case "true":
                return 1 + bonus;
        }
    } else {
        switch (truth) {
            case "pants on fire":
                return 1 + bonus;
            case "false":
                return 1 + bonus;
            case "mostly false":
                return 0.5 + Math.floor(bonus/2);
            case "mostly true":
                return 0;
            case "true":
                return 0;
        }
    }
}

export default function App() {
    const [width, setWidth] = useState(0)
    const [statement, setStatement] = useState<Question>()
    const [answer, setAnswer] = useState<boolean | 0>(0)
    const [points, setPoints] = useState<number>(0)
    const [next, setNext] = useState<boolean>(true)
    const max = useRef(0)
    const color = useRef("")

    useEffect(() => {
        if (next) {
            console.log("Hej!")

            setStatement(questions[Math.floor(Math.random() * questions.length)])
            setNext(false)
            setAnswer(0)
            setWidth(0)

            color.current = "bg-gray-500"
        }
    }, [next])

    useEffect(() => {
        if (answer !== 0) {
            switch (statement?.answer) {
                case "pants on fire":
                    max.current = 20
                    color.current = "bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
                    break
                case "false":
                    max.current = 40
                    color.current = "bg-red-500"
                    break
                case "mostly false":
                    max.current = 60
                    color.current = "bg-orange-500"
                    break
                case "mostly true":
                    max.current = 80
                    color.current = "bg-green-300"
                    break
                case "true":
                    max.current = 100
                    color.current = "bg-green-500"
                    break
                default:
                    max.current = 0
                    color.current = "bg-gray-500"
                    break
            }
        }

        console.log(max)
        console.log(color)
    }, [answer, statement])

    useEffect(() => {
        if (answer !== 0) {
            if (width >= max.current) {
                return;
            }

            setTimeout(() => {
                setWidth(width + 1)
            }, 5)
        }
    }, [answer, width, max])

    const handleTrue = () => {
        setAnswer(true)
        setPoints(points + genPoints(true, statement?.answer, statement?.difficulty))
    }
    const handleFalse = () => {
        setAnswer(false)
        setPoints(points + genPoints(false, statement?.answer, statement?.difficulty))
    }
    const handleNext = () => {
        setNext(true)
    }

    return (
        <>
            <div className="p-4 w-[50%]">
                <div className="pb-4">
                    <div className="font-bold text-xl">Question: {statement?.question}</div>
                    <div className="text-sm">Difficulty: {difficulty(statement?.difficulty)}</div>
                    <div className="text-sm">Points: {points}</div>
                </div>

                <div className="w-3/6 bg-gray-200 rounded-full h-5 dark:bg-gray-700">
                    <div className={`left-3 ${color.current} h-5 rounded-full`} style={{ width: width + "%" }}></div>
                </div>
                <div className="font-semibold">
                    {toProperCase(answer === 0 ? "???" : (statement?.answer ?? "..."))}
                </div>

                <div className="flex gap-2 py-3">
                    <button className={`border-2 border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white py-2 px-5 rounded-md transition-all duration-300 text-center text-sm font-semibold ${answer === true ? "disabled:border-lime-700 disabled:text-white disabled:bg-lime-700 disabled:hover:bg-lime-700" : "disabled:border-lime-700 disabled:text-lime-700 disabled:hover:bg-white disabled:hover:text-lime-700"}`} onClick={handleTrue} disabled={answer !== 0}>
                        True
                    </button>
                    <button className={`border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-2 px-5 rounded-md transition-all duration-300 text-center text-sm font-semibold ${answer === false ? "disabled:border-red-700 disabled:text-white disabled:bg-red-700 disabled:hover:bg-red-700" : "disabled:border-red-700 disabled:text-red-700 disabled:hover:bg-white disabled:hover:text-red-700"}`} onClick={handleFalse} disabled={answer !== 0}>
                        False
                    </button>
                </div>

                {!(answer === 0) &&
                    <>
                        <div className="bg-slate-200 rounded-md p-4">
                            <div className="font-bold pb-2">Why?</div>
                            <div>{statement?.why}</div>
                        </div>

                        <button className="border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white py-2 px-5 rounded-md transition-all duration-300 text-center text-sm font-semibold mt-2" onClick={handleNext}>
                            Next
                        </button>
                    </>
                }
            </div>
        </>
    )
}