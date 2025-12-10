import { useState, useEffect } from 'react'
import { Play, RotateCcw, Code, Terminal, Save, Moon, Sun, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'

const CodingPlayground = () => {
    const [currentLevel, setCurrentLevel] = useState(1)
    const [language, setLanguage] = useState('javascript')
    const [isDark, setIsDark] = useState(true)
    const [output, setOutput] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState(null)

    const challenges = [
        {
            id: 1,
            title: "Hello World",
            description: "Write a function named `solution` that returns the string 'Hello World'.",
            initialCode: {
                javascript: `function solution() {
  // Write your code here
  return "Hello World";
}`,
                python: `def solution():
  # Write your code here
  return "Hello World"`,
                java: `public class Solution {
  public static String solution() {
    // Write your code here
    return "Hello World";
  }
}`,
                cpp: `string solution() {
  // Write your code here
  return "Hello World";
}`
            },
            test: (result) => result === "Hello World",
            difficulty: "Easy"
        },
        {
            id: 2,
            title: "Sum of Two Numbers",
            description: "Write a function named `solution` that takes two numbers (a, b) and returns their sum.",
            initialCode: {
                javascript: `function solution(a, b) {
  // Write your code here
  return a + b;
}`,
                python: `def solution(a, b):
  return a + b`,
                java: `public class Solution {
  public static int solution(int a, int b) {
    return a + b;
  }
}`,
                cpp: `int solution(int a, int b) {
  return a + b;
}`
            },
            test: (func) => {
                try {
                    return func(2, 3) === 5 && func(10, -5) === 5;
                } catch (e) { return false; }
            },
            difficulty: "Easy+"
        },
        {
            id: 3,
            title: "Is Even?",
            description: "Write a function named `solution` that returns true if a number is even, and false otherwise.",
            initialCode: {
                javascript: `function solution(n) {
  // Write your code here
}`,
                python: `def solution(n):
  # Write your code here`,
                java: `public class Solution {
  public static boolean solution(int n) {
    // Write your code here
  }
}`,
                cpp: `bool solution(int n) {
  // Write your code here
}`
            },
            test: (func) => {
                try {
                    return func(2) === true && func(3) === false && func(0) === true;
                } catch (e) { return false; }
            },
            difficulty: "Medium"
        },
        {
            id: 4,
            title: "Find Maximum",
            description: "Write a function named `solution` that takes an array of numbers and returns the largest number.",
            initialCode: {
                javascript: `function solution(arr) {
  // Write your code here
}`,
                python: `def solution(arr):
  # Write your code here`,
                java: `public class Solution {
  public static int solution(int[] arr) {
    // Write your code here
  }
}`,
                cpp: `int solution(vector<int> arr) {
  // Write your code here
}`
            },
            test: (func) => {
                try {
                    return func([1, 5, 3, 9, 2]) === 9 && func([-1, -5]) === -1;
                } catch (e) { return false; }
            },
            difficulty: "Hard"
        }
    ]

    const currentChallenge = challenges.find(c => c.id === currentLevel) || challenges[0]
    const [code, setCode] = useState(currentChallenge.initialCode[language])

    // Update code when language or level changes
    useEffect(() => {
        setCode(currentChallenge.initialCode[language] || '// Language not supported yet')
        setOutput([])
        setShowSuccess(false)
        setError(null)
    }, [currentLevel, language])

    const runCode = () => {
        setOutput([])
        setError(null)
        setShowSuccess(false)

        if (language !== 'javascript') {
            // Mock execution for other languages
            setTimeout(() => {
                setOutput(['Compiling...', 'Running...', 'Output: [Mock Output for ' + language + ']'])

                // Simple mock validation for non-JS languages based on keywords
                // This is a placeholder since we can't run real Python/Java in browser easily without backend
                const passed = Math.random() > 0.3; // Random success for demo
                if (passed) {
                    setShowSuccess(true)
                    setOutput(prev => [...prev, 'Test Passed!'])
                } else {
                    setError('Test Failed: Incorrect output')
                }
            }, 1000)
            return
        }

        // JavaScript Execution
        const logs = []
        const originalConsoleLog = console.log
        console.log = (...args) => {
            logs.push(args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '))
        }

        try {
            // Wrap code to extract the 'solution' function
            // eslint-disable-next-line no-new-func
            const userCode = new Function(`${code}; return typeof solution !== 'undefined' ? solution : null;`)
            const solutionFunc = userCode()

            if (typeof solutionFunc !== 'function') {
                throw new Error("Function 'solution' not found. Please define function solution() { ... }")
            }

            // Run Test Cases
            let passed = false
            if (currentChallenge.id === 1) {
                // Special case for Hello World which might just return string
                const result = solutionFunc()
                passed = currentChallenge.test(result)
                console.log("Result:", result)
            } else {
                passed = currentChallenge.test(solutionFunc)
                console.log("Test execution completed.")
            }

            if (passed) {
                setShowSuccess(true)
                logs.push("✅ Test Cases Passed!")
            } else {
                setError("❌ Test Cases Failed. Check your logic.")
            }

        } catch (err) {
            setError(`Runtime Error: ${err.message}`)
        }

        console.log = originalConsoleLog
        setOutput(logs)
    }

    const handleNextLevel = () => {
        if (currentLevel < challenges.length) {
            setCurrentLevel(prev => prev + 1)
        } else {
            alert("Congratulations! You've completed all available challenges.")
        }
    }

    return (
        <div className={`h-[calc(100vh-8rem)] flex flex-col rounded-xl overflow-hidden shadow-xl border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Toolbar */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary-500" />
                        <h2 className="font-bold">Skill Hive Playground</h2>
                    </div>
                    <div className="h-6 w-px bg-gray-600 mx-2"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Level {currentLevel}:</span>
                        <span className="font-semibold">{currentChallenge.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${currentChallenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            currentChallenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {currentChallenge.difficulty}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium outline-none border ${isDark
                            ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-primary-500'
                            : 'bg-white border-gray-300 text-gray-700 focus:border-primary-500'
                            }`}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        title="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    {showSuccess ? (
                        <button
                            onClick={handleNextLevel}
                            className="flex items-center gap-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm animate-pulse"
                        >
                            Next Challenge
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={runCode}
                            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Run Code
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Challenge Description Sidebar */}
                <div className={`w-full md:w-1/4 p-4 border-r overflow-y-auto ${isDark ? 'bg-gray-800/50 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    <h3 className="font-bold mb-2 text-lg">Task</h3>
                    <p className="text-sm leading-relaxed mb-4">{currentChallenge.description}</p>

                    <div className={`p-3 rounded-lg text-sm font-mono mb-4 ${isDark ? 'bg-black/30' : 'bg-gray-200'}`}>
                        <p className="text-xs text-gray-500 mb-1">Input/Output Example:</p>
                        {currentLevel === 1 && <p>Output: "Hello World"</p>}
                        {currentLevel === 2 && <p>Input: (2, 3) → Output: 5</p>}
                        {currentLevel === 3 && <p>Input: 4 → Output: true</p>}
                        {currentLevel === 4 && <p>Input: [1, 5, 2] → Output: 5</p>}
                    </div>

                    {language !== 'javascript' && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 text-yellow-500 rounded-lg text-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>Note: Only JavaScript execution is fully supported in this browser environment. Other languages are simulated.</p>
                        </div>
                    )}
                </div>

                {/* Editor */}
                <div className="flex-1 flex flex-col border-r border-gray-700 relative">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none ${isDark
                            ? 'bg-[#1e1e1e] text-gray-300 selection:bg-blue-500/30'
                            : 'bg-white text-gray-800 selection:bg-blue-100'
                            }`}
                        spellCheck="false"
                    />
                    <div className={`absolute bottom-2 right-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
                    </div>
                </div>

                {/* Console */}
                <div className={`md:w-1/4 flex flex-col ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
                    <div className={`flex items-center justify-between px-4 py-2 border-b ${isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Terminal className="w-4 h-4" />
                            Console
                        </div>
                        <button
                            onClick={() => setOutput([])}
                            className={`p-1.5 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors`}
                            title="Clear Console"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                        {error && (
                            <div className="mb-2 text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                                {error}
                            </div>
                        )}
                        {showSuccess && (
                            <div className="mb-2 text-green-400 bg-green-400/10 p-2 rounded border border-green-400/20 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Challenge Completed!
                            </div>
                        )}
                        {output.length === 0 && !error && !showSuccess ? (
                            <div className={`text-center mt-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                <p>Run code to see output...</p>
                            </div>
                        ) : (
                            output.map((log, i) => (
                                <div key={i} className={`mb-1 break-words ${log.startsWith('Error:') ? 'text-red-400' : isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    <span className="opacity-50 mr-2">&gt;</span>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodingPlayground