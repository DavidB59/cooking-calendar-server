import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
import Ingredient from './entity';

@JsonController()
export default class IngredientController {

  // Endpoint for testing only
  @Get('/ingredients/:id([0-9]+)')
  getIngredient(
    @Param('id') id: number
  ) {
    return Ingredient.findOne(id)
  }

  // Endpoint for testing only
  @Get('/ingredients')
  getAllIngredients() {
    return Ingredient.find()
  }

  @Post('/ingredients')
  @HttpCode(201)
  async createIngredient(
    @Body() ingredient : Ingredient)
  {
    return ingredient.save()
  }
}