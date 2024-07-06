import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Like extends Model {
  static table = 'likes';

  @field('content') content;
  @field('category') category;
  @field('review') review;
  @field('star_rating') starRating;
  @field('image') image;
  @field('timestamp') timestamp;
}
