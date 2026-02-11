import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AddTeamMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  userIds: string[];
}
