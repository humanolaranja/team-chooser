# Pokemon Chooser
A software to randomize members in groups

You can config teams availables in `src/config/teams.json` and follow the template. Image assets is in `src/assets/images`

You can change some default configuration values in `src/config/defaultValues.json`.

| name | types | default | detail |
| ------ | ------ | ------ | ------ |
| animate | boolean | true | animate while raffle |
| defaultAnimationMs | number | 128 | ms between animations |
| defaultAnimationTimes | number | 2 | number of times it will animate in array of teams |
| totalDefault | number | 24 |  default number of members to draw  |
| slowDownAnimationRate | number | 24 | ms to increase while animation is ending |

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.