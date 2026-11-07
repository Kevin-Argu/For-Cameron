// Flower equations and RGB palette from "The Bouquet".
// Source: https://www.desmos.com/calculator/n3bgw7hhkd
// Keep source geometry, layering, opacity and parameter domains together.
window.CameronBouquet = {
  "source": "https://www.desmos.com/calculator/n3bgw7hhkd",
  "palette": {
    "3": "#7d486b",
    "1": "#f065b3",
    "2": "#ffffff",
    "4": "#c7207e",
    "pan1": "#473499",
    "pan2": "#4b37bd",
    "pan3": "#cce388",
    "black": "#1e1f1b",
    "pan4": "#e6e367",
    "plum1": "#d13b86",
    "plum2": "#debc35",
    "plum3": "#d6693a",
    "clow": "#46a34e",
    "clow2": "#77d17a",
    "clow3": "#41a046",
    "sun": "#e0cd38",
    "sun1": "#d6bd2f",
    "sun2": "#4a3f24",
    "sun3": "#7d6e43",
    "sun4": "#e0d74f",
    "sun5": "#b4aa32",
    "for": "#5a94d1",
    "for1": "#b3c4e3",
    "for2": "#e6edfa",
    "for3": "#e0b53f",
    "for4": "#463214",
    "hi": "#8f70c4",
    "hi6": "#9778c8",
    "hi1": "#a383d6",
    "hi2": "#b08ee6",
    "hi3": "#821657",
    "hi4": "#edd766",
    "hi5": "#e8db99",
    "lil": "#c685cc",
    "lil1": "#d8a9eb",
    "lil2": "#f0dfec",
    "ry": "#f7d839",
    "ry1": "#fcd32b",
    "ry2": "#ffcb21",
    "ry3": "#fcbc26",
    "ry4": "#f7a919",
    "ry5": "#f2971f",
    "ry6": "#e8811a",
    "ry8": "#db6e1a",
    "ry9": "#db5b1a",
    "ry10": "#a84716",
    "ry11": "#ab7615",
    "ry12": "#e6a735",
    "pet": "#faaff0",
    "pet1": "#ffcff8",
    "pet2": "#fcc7f5",
    "pet3": "#fcdef8",
    "pet4": "#852e70",
    "pet5": "#781d62",
    "pet6": "#786d75",
    "mari": "#f5b41d",
    "mari1": "#f5971d",
    "mari2": "#f5771d",
    "mari3": "#f5d63d",
    "mari4": "#ebcd3d",
    "mari5": "#dec340",
    "mari6": "#d1b943",
    "mari7": "#c2ad44",
    "mari8": "#baa436",
    "mari9": "#c24217",
    "dai": "#a3a3a3",
    "dai1": "#fcf8eb",
    "dai2": "#fffdf5",
    "wist": "#c694eb",
    "wist1": "#f7dcef",
    "wist2": "#ede6a1",
    "wist3": "#c28dd6",
    "wist4": "#b967c2"
  },
  "flowers": [
    {
      "id": "pansy",
      "sourceCenter": [
        175,
        200
      ],
      "scale": 0.065,
      "width": 3.9000000000000004,
      "height": 3.25,
      "expressions": [
        {
          "id": "pansy_228",
          "latex": "P\\ =\\frac{5T}{7}",
          "hidden": true
        },
        {
          "id": "pansy_229",
          "latex": "T=30",
          "hidden": true
        },
        {
          "id": "pansy_260",
          "latex": "B\\ =\\left[\\frac{5}{4},\\frac{3}{2},3,5\\right]",
          "hidden": true
        },
        {
          "id": "pansy_261",
          "latex": "O=\\frac{T}{B}",
          "hidden": true
        },
        {
          "id": "pansy_262",
          "latex": "o=\\frac{P}{B}",
          "hidden": true
        },
        {
          "id": "pansy_251",
          "latex": "X_{1}=175",
          "hidden": true
        },
        {
          "id": "pansy_252",
          "latex": "Y_{1}=200",
          "hidden": true
        },
        {
          "id": "pansy_230",
          "latex": "x_{one}=\\sqrt{\\sin\\left(t-6.5\\right)}^{3}\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_231",
          "latex": "y_{one}=\\sqrt{\\sin\\left(t-6.5\\right)}^{3}\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_232",
          "latex": "x_{two}=\\sqrt{\\cos\\left(t-6.5\\right)}^{3}\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_233",
          "latex": "y_{two}=\\sqrt{\\cos\\left(t-6.5\\right)}^{3}\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_234",
          "latex": "x_{three}=\\sqrt{\\sin\\left(t-2.6\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_237",
          "latex": "y_{three}=\\sqrt{\\sin\\left(t-2.6\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_238",
          "latex": "x_{four}=\\sqrt{\\sin\\left(t-5\\right)}\\sin\\left(t-3.9\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_239",
          "latex": "y_{four}=\\sqrt{\\sin\\left(t-5\\right)}\\sin\\left(t-3.9\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_240",
          "latex": "x_{five}=\\sqrt{\\cos\\left(t-5\\right)}\\cos\\left(t-3\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_241",
          "latex": "y_{five}=\\sqrt{\\cos\\left(t-5\\right)}\\cos\\left(t-3\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_273",
          "latex": "x_{six}=\\sqrt{\\cos\\left(t-5\\right)}\\cos\\left(t-3\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_274",
          "latex": "y_{six}=\\sqrt{\\cos\\left(t-5.\\right)}\\cos\\left(t-2.5\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_277",
          "latex": "x_{seven}=\\left(\\sin t\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "pansy_279",
          "latex": "y_{seven}=\\left(\\sin t\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "pansy_257",
          "latex": "\\left(Px_{two}+X_{1},Py_{two}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#473499"
        },
        {
          "id": "pansy_271",
          "latex": "\\left(ox_{two}+X_{1},oy_{two}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#cce388"
        },
        {
          "id": "pansy_242",
          "latex": "\\left(Px_{one}+X_{1},Py_{one}+Y_{1}\\right)",
          "fill": true,
          "lines": true,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#473499"
        },
        {
          "id": "pansy_270",
          "latex": "\\left(ox_{one}+X_{1},oy_{one}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#cce388"
        },
        {
          "id": "pansy_267",
          "latex": "\\left(Px_{three}+X_{1},Py_{three}+Y_{1}\\right)",
          "fill": true,
          "lines": true,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#4b37bd"
        },
        {
          "id": "pansy_256",
          "latex": "\\left(ox_{three}+X_{1},oy_{three}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.3,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#cce388"
        },
        {
          "id": "pansy_268",
          "latex": "\\left(Tx_{four}+X_{1},Ty_{four}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#4b37bd"
        },
        {
          "id": "pansy_258",
          "latex": "\\left(Ox_{four}+X_{1},Oy_{four}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.3,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#cce388"
        },
        {
          "id": "pansy_269",
          "latex": "\\left(Tx_{five}+X_{1},Ty_{five}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#4b37bd"
        },
        {
          "id": "pansy_259",
          "latex": "\\left(Ox_{five}+X_{1},Oy_{five}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#cce388"
        },
        {
          "id": "pansy_254",
          "latex": "\\left(Tx_{five}+X_{1},Ty_{five}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.7,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "-\\pi",
            "max": "-\\frac{11\\pi}{20}"
          },
          "color": "#1e1f1b"
        },
        {
          "id": "pansy_255",
          "latex": "\\left(Tx_{four}+X_{1},Ty_{four}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.8,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "\\frac{\\pi}{4}",
            "max": "\\pi"
          },
          "color": "#1e1f1b"
        },
        {
          "id": "pansy_275",
          "latex": "\\left(Tx_{six}+X_{1},Ty_{six}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.7,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "-\\pi",
            "max": "-\\frac{11\\pi}{20}"
          },
          "color": "#1e1f1b"
        },
        {
          "id": "pansy_276",
          "latex": "\\left(-\\frac{T}{1}x_{six}+X_{1},-Ty_{six}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.7,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "-\\pi",
            "max": "-\\frac{11\\pi}{20}"
          },
          "color": "#1e1f1b"
        },
        {
          "id": "pansy_280",
          "latex": "\\left(-\\frac{4}{3}x_{seven}+X_{1},-y_{seven}+Y_{1}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.8,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "2\\pi"
          },
          "color": "#e6e367"
        }
      ]
    },
    {
      "id": "sunflower",
      "sourceCenter": [
        275,
        140
      ],
      "scale": 0.029,
      "width": 4.205,
      "height": 4.205,
      "expressions": [
        {
          "id": "sunflower_382",
          "latex": "W=25",
          "hidden": true
        },
        {
          "id": "sunflower_383",
          "latex": "X_{what}=275",
          "hidden": true
        },
        {
          "id": "sunflower_384",
          "latex": "Y_{what}=140",
          "hidden": true
        },
        {
          "id": "sunflower_415",
          "latex": "W_{venue}=\\left[1.2,1.5,2,3,5\\right]",
          "hidden": true
        },
        {
          "id": "sunflower_408",
          "latex": "W_{win}=\\frac{W}{W_{venue}}",
          "hidden": true
        },
        {
          "id": "sunflower_385",
          "latex": "X_{sun}=\\left(W\\sin\\left(\\cos16t\\right)+2W\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_359",
          "latex": "Y_{sun}=\\left(W\\sin\\left(\\cos16t\\right)+2W\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_386",
          "latex": "X_{flo}=\\left(W\\sin\\left(-\\cos12t\\right)+2W\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_387",
          "latex": "Y_{flo}=\\left(W\\sin\\left(-\\cos12t\\right)+2W\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_388",
          "latex": "X_{wer}=\\left(W\\sin\\left(-\\cos10t\\right)+1.5W\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_389",
          "latex": "Y_{wer}=\\left(W\\sin\\left(-\\cos10t\\right)+1.5W\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_390",
          "latex": "X_{write}=\\left(W\\sin\\left(\\cos9t\\right)+1.2W\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_399",
          "latex": "Y_{write}=\\left(W\\sin\\left(\\cos9t\\right)+1.2W\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_400",
          "latex": "X_{shot}=\\left(W\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_401",
          "latex": "Y_{shot}=\\left(W\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_409",
          "latex": "X_{room}=\\left(W_{win}\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "sunflower_414",
          "latex": "Y_{room}=\\left(W_{win}\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "sunflower_402",
          "latex": "\\left(X_{sun}+X_{what},\\ Y_{sun}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#b4aa32"
        },
        {
          "id": "sunflower_391",
          "latex": "\\left(X_{flo}+X_{what},\\ Y_{flo}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#d6bd2f"
        },
        {
          "id": "sunflower_405",
          "latex": "\\left(X_{wer}+X_{what},\\ Y_{wer}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#e0cd38"
        },
        {
          "id": "sunflower_404",
          "latex": "\\left(X_{write}+X_{what},\\ Y_{write}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#e0d74f"
        },
        {
          "id": "sunflower_403",
          "latex": "\\left(X_{shot}+X_{what},\\ Y_{shot}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#7d6e43"
        },
        {
          "id": "sunflower_416",
          "latex": "\\left(X_{room}+X_{what},\\ Y_{room}+Y_{what}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.3,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#4a3f24"
        }
      ]
    },
    {
      "id": "chrysanthemum",
      "sourceCenter": [
        330,
        240
      ],
      "scale": 0.041,
      "width": 3.5260000000000002,
      "height": 3.5260000000000002,
      "expressions": [
        {
          "id": "chrysanthemum_965",
          "latex": "C_{rys}=30",
          "hidden": true
        },
        {
          "id": "chrysanthemum_1000",
          "latex": "X_{cry}=330",
          "hidden": true
        },
        {
          "id": "chrysanthemum_1001",
          "latex": "Y_{cry}=240",
          "hidden": true
        },
        {
          "id": "chrysanthemum_969",
          "latex": "C_{hry}=\\left[0.2,\\ 0.3...0.9\\right]",
          "hidden": true
        },
        {
          "id": "chrysanthemum_966",
          "latex": "x_{ch}=C_{rys}\\sqrt{\\log_{2}\\left(\\cos20t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_971",
          "latex": "y_{ch}=C_{rys}\\sqrt{\\log_{2}\\left(\\cos20t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_972",
          "latex": "x_{ry}=\\left(C_{rys}\\cdot C_{hry}\\left[8\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos20t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_967",
          "latex": "y_{ry}=\\left(C_{rys}\\cdot C_{hry}\\left[8\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos20t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_968",
          "latex": "x_{sa}=\\left(C_{rys}\\cdot C_{hry}\\left[7\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos20t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_974",
          "latex": "y_{sa}=\\left(C_{rys}\\cdot C_{hry}\\left[7\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos20t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_975",
          "latex": "x_{nt}=\\left(C_{rys}\\cdot C_{hry}\\left[6\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_977",
          "latex": "y_{nt}=\\left(C_{rys}\\cdot C_{hry}\\left[6\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_976",
          "latex": "x_{he}=\\left(C_{rys}\\cdot C_{hry}\\left[5\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos13t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_981",
          "latex": "y_{he}=\\left(C_{rys}\\cdot C_{hry}\\left[5\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos13t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_978",
          "latex": "x_{mu}=\\left(C_{rys}\\cdot C_{hry}\\left[4\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_983",
          "latex": "y_{mu}=\\left(C_{rys}\\cdot C_{hry}\\left[4\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_982",
          "latex": "x_{m}=\\left(C_{rys}\\cdot C_{hry}\\left[3\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos15t+3\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_984",
          "latex": "y_{m}=\\left(C_{rys}\\cdot C_{hry}\\left[3\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos15t+3\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_979",
          "latex": "x_{chry}=\\left(C_{rys}\\cdot C_{hry}\\left[3\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+2\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_985",
          "latex": "y_{chry}=\\left(C_{rys}\\cdot C_{hry}\\left[3\\right]\\right)\\sqrt{\\log_{2}\\left(-\\cos15t+2\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_980",
          "latex": "x_{santhe}=\\left(C_{rys}\\cdot C_{hry}\\left[2\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos11t+2\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_986",
          "latex": "y_{santhe}=\\left(C_{rys}\\cdot C_{hry}\\left[2\\right]\\right)\\sqrt{\\log_{2}\\left(\\cos11t+2\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_987",
          "latex": "x_{mum}=\\left(C_{rys}\\cdot C_{hry}\\left[1\\right]\\right)\\sqrt{\\log_{3}\\left(-\\cos10t+4\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_988",
          "latex": "y_{mum}=\\left(C_{rys}\\cdot C_{hry}\\left[1\\right]\\right)\\sqrt{\\log_{3}\\left(-\\cos10t+4\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "chrysanthemum_989",
          "latex": "\\left(x_{ch}+X_{cry},y_{ch}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f7d839"
        },
        {
          "id": "chrysanthemum_1019",
          "latex": "\\left(C_{hry}x_{ch}+X_{cry},C_{hry}y_{ch}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ab7615"
        },
        {
          "id": "chrysanthemum_1018",
          "latex": "\\left(x_{ry}+X_{cry},y_{ry}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#fcd32b"
        },
        {
          "id": "chrysanthemum_1017",
          "latex": "\\left(C_{hry}x_{ry}+X_{cry},C_{hry}y_{ry}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ab7615"
        },
        {
          "id": "chrysanthemum_1016",
          "latex": "\\left(x_{sa}+X_{cry},y_{sa}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ffcb21"
        },
        {
          "id": "chrysanthemum_1015",
          "latex": "\\left(C_{hry}x_{sa}+X_{cry},C_{hry}y_{sa}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ab7615"
        },
        {
          "id": "chrysanthemum_1014",
          "latex": "\\left(x_{nt}+X_{cry},y_{nt}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#fcbc26"
        },
        {
          "id": "chrysanthemum_1013",
          "latex": "\\left(C_{hry}x_{nt}+X_{cry},C_{hry}y_{nt}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ab7615"
        },
        {
          "id": "chrysanthemum_1012",
          "latex": "\\left(x_{he}+X_{cry},y_{he}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f7a919"
        },
        {
          "id": "chrysanthemum_1011",
          "latex": "\\left(C_{hry}x_{he}+X_{cry},C_{hry}y_{he}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a84716"
        },
        {
          "id": "chrysanthemum_1010",
          "latex": "\\left(x_{mu}+X_{cry},y_{mu}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f2971f"
        },
        {
          "id": "chrysanthemum_1009",
          "latex": "\\left(C_{hry}x_{mu}+X_{cry},C_{hry}y_{mu}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a84716"
        },
        {
          "id": "chrysanthemum_1008",
          "latex": "\\left(x_{m}+X_{cry},y_{m}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#e8811a"
        },
        {
          "id": "chrysanthemum_1007",
          "latex": "\\left(C_{hry}x_{m}+X_{cry},C_{hry}y_{m}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a84716"
        },
        {
          "id": "chrysanthemum_1006",
          "latex": "\\left(x_{chry}+X_{cry},y_{chry}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#db6e1a"
        },
        {
          "id": "chrysanthemum_1005",
          "latex": "\\left(C_{hry}x_{chry}+X_{cry},C_{hry}y_{chry}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a84716"
        },
        {
          "id": "chrysanthemum_1004",
          "latex": "\\left(x_{santhe}+X_{cry},y_{santhe}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#db5b1a"
        },
        {
          "id": "chrysanthemum_1003",
          "latex": "\\left(C_{hry}x_{santhe}+X_{cry},C_{hry}y_{santhe}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a84716"
        },
        {
          "id": "chrysanthemum_1002",
          "latex": "\\left(x_{mum}+X_{cry},y_{mum}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#e6a735"
        },
        {
          "id": "chrysanthemum_1024",
          "latex": "\\left(C_{hry}x_{mum}+X_{cry},C_{hry}y_{mum}+Y_{cry}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.1,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ab7615"
        }
      ]
    },
    {
      "id": "marigold",
      "sourceCenter": [
        240,
        315
      ],
      "scale": 0.065,
      "width": 3.705,
      "height": 3.705,
      "expressions": [
        {
          "id": "marigold_1129",
          "latex": "M_{ari}=20",
          "hidden": true
        },
        {
          "id": "marigold_1130",
          "latex": "X_{mari}=240",
          "hidden": true
        },
        {
          "id": "marigold_1131",
          "latex": "Y_{mari}=315",
          "hidden": true
        },
        {
          "id": "marigold_1132",
          "latex": "M_{gold}=\\frac{M_{ari}}{2}",
          "hidden": true
        },
        {
          "id": "marigold_1133",
          "latex": "M_{gild}=\\frac{M_{ari}}{5}",
          "hidden": true
        },
        {
          "id": "marigold_1152",
          "latex": "M_{help}=\\frac{M_{ari}}{10}",
          "hidden": true
        },
        {
          "id": "marigold_1196",
          "latex": "M_{pls}=\\left[0.9,\\ 0.8...0.1\\right]",
          "hidden": true
        },
        {
          "id": "marigold_1134",
          "latex": "x_{Im}=M_{ari}\\sqrt{\\left(\\sin\\left(\\cos9t-4\\right)\\right)+1}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1135",
          "latex": "y_{Im}=M_{ari}\\sqrt{\\left(\\sin\\left(\\cos9t-4\\right)\\right)+1}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1136",
          "latex": "x_{dying}=M_{ari}\\sqrt{\\left(\\sin\\left(-\\cos9t-4\\right)\\right)+0.7}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1137",
          "latex": "y_{dying}=M_{ari}\\sqrt{\\left(\\sin\\left(-\\cos9t-4\\right)\\right)+0.7}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1138",
          "latex": "x_{pls}=M_{ari}\\sqrt{\\left(\\sin\\left(-\\cos7t-10\\right)+0.2\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1153",
          "latex": "y_{pls}=M_{ari}\\sqrt{\\left(\\sin\\left(-\\cos7t-10\\right)+0.2\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1139",
          "latex": "x_{send}=M_{ari}\\sqrt{\\left(\\sin\\left(\\cos7t-10\\right)\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1140",
          "latex": "y_{send}=M_{ari}\\sqrt{\\left(\\sin\\left(\\cos7t-10\\right)\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1141",
          "latex": "x_{help}=M_{gold}\\sqrt{\\left(\\sin\\left(\\cos5t-4\\right)+0.5\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1142",
          "latex": "y_{help}=M_{gold}\\sqrt{\\left(\\sin\\left(\\cos5t-4\\right)+0.5\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1143",
          "latex": "x_{asap}=M_{gold}\\sqrt{\\left(\\sin\\left(-\\cos5t-4\\right)+0.2\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1144",
          "latex": "y_{asap}=M_{gold}\\sqrt{\\left(\\sin\\left(-\\cos5t-4\\right)+0.2\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1145",
          "latex": "x_{4}=\\left(M_{gild}\\tan\\left(\\cos10t\\right)-0.2\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1154",
          "latex": "y_{4}=\\left(M_{gild}\\tan\\left(\\cos10t\\right)-0.2\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1155",
          "latex": "x_{finish}=M_{help}\\tan\\left(\\cos3t\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1156",
          "latex": "y_{finish}=M_{help}\\tan\\left(\\cos3t\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1157",
          "latex": "x_{ing}=M_{help}\\tan\\left(\\cos3\\left(t-6\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1146",
          "latex": "y_{ing}=M_{help}\\tan\\left(\\cos3\\left(t-6\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1147",
          "latex": "x_{the}=M_{help}\\tan\\left(\\cos3\\left(t-12\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1164",
          "latex": "y_{the}=M_{help}\\tan\\left(\\cos3\\left(t-12\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1158",
          "latex": "x_{ma}=M_{help}\\tan\\left(\\cos3\\left(t-18\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1167",
          "latex": "y_{ma}=M_{help}\\tan\\left(\\cos3\\left(t-18\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1165",
          "latex": "x_{ri}=M_{help}\\tan\\left(\\cos3\\left(t-24\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1166",
          "latex": "y_{ri}=M_{help}\\tan\\left(\\cos3\\left(t-24\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1168",
          "latex": "x_{go}=M_{help}\\tan\\left(\\cos3\\left(t-30\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1169",
          "latex": "y_{go}=M_{help}\\tan\\left(\\cos3\\left(t-30\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1170",
          "latex": "x_{ld}=M_{help}\\tan\\left(\\cos3\\left(t-36\\right)\\right)\\cos t",
          "hidden": true
        },
        {
          "id": "marigold_1159",
          "latex": "y_{ld}=M_{help}\\tan\\left(\\cos3\\left(t-36\\right)\\right)\\sin t",
          "hidden": true
        },
        {
          "id": "marigold_1160",
          "latex": "\\left(x_{Im}+X_{mari},y_{Im}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f7d839"
        },
        {
          "id": "marigold_1197",
          "latex": "\\left(M_{pls}x_{Im}+X_{mari},M_{pls}y_{Im}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#db5b1a"
        },
        {
          "id": "marigold_1185",
          "latex": "\\left(x_{dying}+X_{mari},y_{dying}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ffcb21"
        },
        {
          "id": "marigold_1198",
          "latex": "\\left(M_{pls}x_{dying}+X_{mari},M_{pls}y_{dying}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#c24217"
        },
        {
          "id": "marigold_1184",
          "latex": "\\left(x_{pls}+X_{mari},y_{pls}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f5971d"
        },
        {
          "id": "marigold_1199",
          "latex": "\\left(M_{pls}x_{pls}+X_{mari},M_{pls}y_{pls}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#c24217"
        },
        {
          "id": "marigold_1200",
          "latex": "\\left(x_{send}+X_{mari},y_{send}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#e8811a"
        },
        {
          "id": "marigold_1183",
          "latex": "\\left(M_{pls}x_{send}+X_{mari},M_{pls}y_{send}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#c24217"
        },
        {
          "id": "marigold_1182",
          "latex": "\\left(x_{help}+X_{mari},y_{help}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f5771d"
        },
        {
          "id": "marigold_1201",
          "latex": "\\left(M_{pls}x_{help}+X_{mari},M_{pls}y_{help}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.2,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#c24217"
        },
        {
          "id": "marigold_1181",
          "latex": "\\left(x_{4}+X_{mari},y_{4}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f2971f"
        },
        {
          "id": "marigold_1180",
          "latex": "\\left(x_{finish}+X_{mari},y_{finish}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#f5d63d"
        },
        {
          "id": "marigold_1179",
          "latex": "\\left(x_{ing}+X_{mari},y_{ing}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ebcd3d"
        },
        {
          "id": "marigold_1178",
          "latex": "\\left(x_{the}+X_{mari},y_{the}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#dec340"
        },
        {
          "id": "marigold_1177",
          "latex": "\\left(x_{ma}+X_{mari},y_{ma}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#d1b943"
        },
        {
          "id": "marigold_1176",
          "latex": "\\left(x_{ri}+X_{mari},y_{ri}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#d1b943"
        },
        {
          "id": "marigold_1175",
          "latex": "\\left(x_{go}+X_{mari},y_{go}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#c2ad44"
        },
        {
          "id": "marigold_1174",
          "latex": "\\left(x_{ld}+X_{mari},y_{ld}+Y_{mari}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#baa436"
        }
      ]
    },
    {
      "id": "daisy",
      "sourceCenter": [
        300,
        310
      ],
      "scale": 0.06,
      "width": 3.5999999999999996,
      "height": 3.5999999999999996,
      "expressions": [
        {
          "id": "daisy_1209",
          "latex": "D_{ie}=25",
          "hidden": true
        },
        {
          "id": "daisy_1218",
          "latex": "X_{dai}=300",
          "hidden": true
        },
        {
          "id": "daisy_1219",
          "latex": "Y_{dai}=310",
          "hidden": true
        },
        {
          "id": "daisy_1220",
          "latex": "D_{ye}=D_{ie}\\cdot0.97",
          "hidden": true
        },
        {
          "id": "daisy_1210",
          "latex": "D_{dai}=D_{ie}\\cdot0.35",
          "hidden": true
        },
        {
          "id": "daisy_1229",
          "latex": "D_{dais}=D_{ie}\\cdot1.2",
          "hidden": true
        },
        {
          "id": "daisy_1221",
          "latex": "x_{die}=D_{dais}\\cos t",
          "hidden": true
        },
        {
          "id": "daisy_1211",
          "latex": "y_{die}=D_{dais}\\sin t",
          "hidden": true
        },
        {
          "id": "daisy_1222",
          "latex": "x_{dai}=D_{ie}\\sqrt{\\left(\\sin\\left(\\cos11t-4.1\\right)\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "daisy_1212",
          "latex": "y_{dai}=D_{ie}\\sqrt{\\left(\\sin\\left(\\cos11t-4.1\\right)\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "daisy_1213",
          "latex": "x_{dye}=D_{ye}\\sqrt{\\left(\\sin\\left(-\\cos11t-4\\right)\\right)}\\cos t",
          "hidden": true
        },
        {
          "id": "daisy_1223",
          "latex": "y_{dye}=D_{ye}\\sqrt{\\left(\\sin\\left(-\\cos11t-4\\right)\\right)}\\sin t",
          "hidden": true
        },
        {
          "id": "daisy_1224",
          "latex": "x_{dais}=D_{dai}\\cos t",
          "hidden": true
        },
        {
          "id": "daisy_1228",
          "latex": "y_{dais}=D_{dai}\\sin t",
          "hidden": true
        },
        {
          "id": "daisy_1216",
          "latex": "\\left(x_{die}+X_{dai},y_{die}+Y_{dai}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 0.5,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#a3a3a3"
        },
        {
          "id": "daisy_1233",
          "latex": "\\left(x_{dai}+X_{dai},y_{dai}+Y_{dai}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#fcf8eb"
        },
        {
          "id": "daisy_1232",
          "latex": "\\left(x_{dye}+X_{dai},y_{dye}+Y_{dai}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#fffdf5"
        },
        {
          "id": "daisy_1231",
          "latex": "\\left(x_{dais}+X_{dai},y_{dais}+Y_{dai}\\right)",
          "fill": true,
          "lines": false,
          "fillOpacity": 1.0,
          "lineOpacity": 1.0,
          "lineWidth": 2.5,
          "parametricDomain": {
            "min": "0",
            "max": "12\\pi"
          },
          "color": "#ebcd3d"
        }
      ]
    }
  ]
};
