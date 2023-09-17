import figlet from "figlet";

const logo = figlet.textSync("ppm", {
  font: "Isometric2",
});

const welcomeText = `
${logo}

       Personal.Passowrd.Manager

`;

export function welcome() {
  console.log(welcomeText);
}
