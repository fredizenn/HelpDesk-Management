/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  // plugins: [require("daisyui")],
  plugins: [
    // (({ addVariant }) => {
    //   addVariant('$touched', '&[data-$touched]')
    // }),
    require("daisyui")
  ],

  daisyui: {
    themes: false,
  }
}
