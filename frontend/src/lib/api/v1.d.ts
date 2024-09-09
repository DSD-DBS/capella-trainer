/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/training": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Training */
        get: operations["get_training_training_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/training/lesson/{lesson_path}/checks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Run Training Lesson Checks */
        post: operations["run_training_lesson_checks_training_lesson__lesson_path__checks_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/training/lesson/{lesson_path}/quiz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Quiz */
        get: operations["get_quiz_training_lesson__lesson_path__quiz_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/training/lesson/{lesson_path}/load_project": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Load Lesson Project */
        post: operations["load_lesson_project_training_lesson__lesson_path__load_project_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/training/lesson/{lesson_path}/project_status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Project Status */
        get: operations["get_project_status_training_lesson__lesson_path__project_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/training/lesson/{lesson_path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Training Lesson */
        get: operations["get_training_lesson_training_lesson__lesson_path__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Folder */
        Folder: {
            /**
             * Name
             * @description Display name of the element.
             */
            name: string;
            /**
             * Path
             * @description Path to the element.
             */
            path: string[];
            /**
             * Slug
             * @description Filename of the element.
             */
            slug: string;
            /**
             * Type
             * @description Type of the element.
             * @default folder
             */
            type: string;
            /**
             * Children
             * @description List of lessons and folders.
             */
            children: (components["schemas"]["Folder"] | components["schemas"]["Lesson"])[];
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** Lesson */
        Lesson: {
            /**
             * Name
             * @description Display name of the element.
             */
            name: string;
            /**
             * Path
             * @description Path to the element.
             */
            path: string[];
            /**
             * Slug
             * @description Filename of the element.
             */
            slug: string;
            /**
             * Type
             * @description Type of the element.
             * @default lesson
             */
            type: string;
            /**
             * Content
             * @description Markdown content
             */
            content: string;
            /**
             * Has Tasks
             * @description Whether the lesson has tasks.
             * @default false
             */
            has_tasks: boolean;
            /**
             * Task Text
             * @description Text for the tasks.
             */
            task_text?: string | null;
            /**
             * Has Quiz
             * @description Whether the lesson has a quiz.
             * @default false
             */
            has_quiz: boolean;
            /**
             * Start Project
             * @description Project to load at the start of the lesson.
             */
            start_project?: string | null;
            /**
             * Show Capella
             * @description Whether to show Capella or exclusively the lesson.
             */
            show_capella?: boolean | null;
        };
        /** MultipleChoiceQuestion */
        MultipleChoiceQuestion: {
            /**
             * Text
             * @description The text of the question
             */
            text: string;
            /**
             * Explanation
             * @description Explanation of the answer
             */
            explanation: string;
            /**
             * Question Type
             * @description Type of the question
             * @constant
             * @enum {string}
             */
            question_type: "multiple_choice";
            /**
             * Id
             * @description ID of the question
             */
            id: number;
            /**
             * Options
             * @description List of possible answers
             */
            options: string[];
            /**
             * Correct Options
             * @description List of correct choice indices
             */
            correct_options: number[];
        };
        /**
         * ProjectStatus
         * @enum {string}
         */
        ProjectStatus: "UNLOADED" | "WORKING" | "WRONG_PROJECT" | "UNKNOWN";
        /** Quiz */
        Quiz: {
            /**
             * Questions
             * @description List of questions
             */
            questions: (components["schemas"]["MultipleChoiceQuestion"] | components["schemas"]["SingleChoiceQuestion"])[];
        };
        /** SingleChoiceQuestion */
        SingleChoiceQuestion: {
            /**
             * Text
             * @description The text of the question
             */
            text: string;
            /**
             * Explanation
             * @description Explanation of the answer
             */
            explanation: string;
            /**
             * Question Type
             * @description Type of the question
             * @constant
             * @enum {string}
             */
            question_type: "single_choice";
            /**
             * Id
             * @description ID of the question
             */
            id: number;
            /**
             * Options
             * @description List of possible answers
             */
            options: string[];
            /**
             * Correct Option
             * @description Index of the correct choice
             */
            correct_option: number;
        };
        /** TaskResult */
        TaskResult: {
            /** Description */
            description: string;
            /** Was Executed */
            was_executed: boolean;
            /** Success */
            success: boolean;
            /** Message */
            message: string | null;
        };
        /** Training */
        Training: {
            /** Name */
            name: string;
            /** Description */
            description: string;
            /** Author */
            author: string;
            /** Difficulty */
            difficulty: number;
            /** Duration */
            duration: string;
            /** @description Root folder of the training. */
            root: components["schemas"]["Folder"];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_training_training_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Training"];
                };
            };
        };
    };
    run_training_lesson_checks_training_lesson__lesson_path__checks_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lesson_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaskResult"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_quiz_training_lesson__lesson_path__quiz_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lesson_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Quiz"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    load_lesson_project_training_lesson__lesson_path__load_project_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lesson_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_project_status_training_lesson__lesson_path__project_status_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lesson_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectStatus"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_training_lesson_training_lesson__lesson_path__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                lesson_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Lesson"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
