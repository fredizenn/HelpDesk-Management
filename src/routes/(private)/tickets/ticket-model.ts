export interface ITicket {
    ticketDescription: string,
    contactName: string,
    contactPhoneNumber: string,
    contactEmail: string,
    code?: string
}

export const initTicket: ITicket = {
    ticketDescription: '',
    contactName: '',
    contactEmail: '',
    contactPhoneNumber: '',
}