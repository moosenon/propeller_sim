import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"

const extensions = [".ts"]

const babelOptions = {
    babelrc: false,
    extensions,
    exclude: "**/node_modules/**",
    babelHelpers: 'bundled',
    presets: [
        [
            "@babel/preset-env",
            {
                modules: false,
                targets: "> 0.25%, not dead",
            },
        ],
        "@babel/preset-typescript",
    ],
}

export default [
    {
        input: "./src/propellerSim",
        output: { 
            file: "dist/propellerSim.js", 
            format: "umd",
            name: "propellerSim", 
        },
        plugins: [
            resolve({ extensions }),
            babel(babelOptions)
        ],
    }
]
