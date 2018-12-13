import 'reflect-metadata'
import { Action, BadRequestError, createKoaServer } from "routing-controllers"
import setupDb from './db'
import UserController from './users/controller';
import { verify } from './jwt'
import User from './users/entity'
import LoginController from './logins/controller';
import PlannerController from './planners/controller';
import RecipeController from './recipes/controller';
import RecipeIngredientController from './recipeIngredients/controller';
import DayController from './days/controller';
import UnitController from './units/controller';

const port = process.env.PORT || 4000

const app = createKoaServer({
  cors: true,
  controllers: [
    UserController,
    LoginController,
    PlannerController,
    RecipeController,
    RecipeIngredientController,
    DayController,
    UnitController
  ],

  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ')

      try {
        return !!(token && verify(token)) 
      }
      catch (e) {
        throw new BadRequestError(e)
      }
    }

    return false
  },

  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ')

      if (token) {
        const { id } = verify(token) 
        return User.findOne(id)
      }
    }
    return undefined
  },

  
})

setupDb()
  .then(_ =>
    app.listen(port, () => console.log(`Listening on port ${port}`))
  )
  .catch(err => console.error(err))

