import { IsInt, IsPositive, IsString } from 'class-validator';

export class DownloadFileDto {
  //check if fileId is string integer
  @IsString()
  fileId: string;
}
