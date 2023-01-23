import moment, {type Moment, type unitOfTime} from 'moment';


export const basicFormatter = (momentDate: Moment, amount: number, type: unitOfTime.DurationConstructor) => {
    return moment(momentDate).add(amount, type).format('YYYY-MM-DD')
}

