export interface ITicket {
    ticketDescription: string,
    contactName: string,
    contactPhoneNumber: string,
    contactEmail: string,
    type: string,
    priority: string,
    departmentId: any,
    facultyId: any;
}

export const initTicket: ITicket = {
    ticketDescription: '',
    contactName: '',
    contactEmail: '',
    contactPhoneNumber: '',
    type: '',
    priority: '',
    departmentId: null,
    facultyId: null
}