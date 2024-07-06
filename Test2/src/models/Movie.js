import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Movie extends Model {
  static table = 'movies';

  @field('tconst') tconst;
  @field('title_type') titleType;
  @field('primary_title') primaryTitle;
  @field('original_title') originalTitle;
  @field('start_year') startYear;
  @field('genres') genres;
  @field('num_votes') numVotes;
}
