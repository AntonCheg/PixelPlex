import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsOptional
} from 'class-validator';
import { FileStatusEnum } from '../db/models';

export class GetFilesQueryDto {
  @IsOptional() // Этот параметр не обязателен
  @IsArray()
  @ArrayNotEmpty()
  // Параметр statuses должен быть массивом строк, каждая строка должна быть валидным значением FileStatusEnum
  @IsEnum(FileStatusEnum, { each: true })
  statuses: FileStatusEnum[];
}
