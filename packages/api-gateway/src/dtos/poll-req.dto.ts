import { IsString, IsArray, IsNumber } from 'class-validator';

export class PollReqDto {
  @IsString()
  question: string;

  @IsArray()
  answerOptions: string[];

  @IsArray()
  answers: {
    userName: string;
    selectedOption: number;
  }[];
}

export class GetPollReqDto {
  @IsString()
  pollId: string;
}

export class AnswerReqDto {
  @IsString()
  pollId: string;

  @IsString()
  userName: string;

  @IsNumber()
  selectedOption: number;
}
