import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isRut', async: false })
export class IsRutConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        if (typeof value !== 'string') return false;
        const cleanRut = value.replace(/\./g, '').replace(/-/g, '').toUpperCase();

        if (cleanRut.length < 8 || cleanRut.length > 9) return false;

        const body = cleanRut.slice(0, -1);
        const dv = cleanRut.slice(-1);

        return this.calculateDV(body) === dv;
    }

    private calculateDV(rutBody: string): string {
        let sum = 0;
        let multiplier = 2;

        for (let i = rutBody.length - 1; i >= 0; i--) {
            sum += parseInt(rutBody[i]) * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }

        const res = 11 - (sum % 11);
        if (res === 11) return '0';
        if (res === 10) return 'K';
        return res.toString();
    }

    defaultMessage() {
        return 'El RUT ingresado no es válido';
    }
}

export function IsRut(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsRutConstraint,
        });
    };
}