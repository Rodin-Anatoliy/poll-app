export interface IAnswer {
  userName: string;
  selectedOption: number;
  userId: string;
}
export interface IPoll {
  question: string;
  answerOptions: string[];
  answers?: IAnswer[];
}
