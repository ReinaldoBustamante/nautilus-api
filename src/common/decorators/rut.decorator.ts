import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsRut(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsRut',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (!value || typeof value !== 'string') return false;

                    const rut = value.replace(/\./g, '').replace('-', '');

                    if (!/^\d+k?$/.test(rut.toLowerCase())) return false;

                    const body = rut.slice(0, -1);
                    const dv = rut.slice(-1).toLowerCase();

                    let sum = 0;
                    let multiplier = 2;

                    for (let i = body.length - 1; i >= 0; i--) {
                        sum += Number(body[i]) * multiplier;
                        multiplier = multiplier === 7 ? 2 : multiplier + 1;
                    }

                    const expectedDv =
                        11 - (sum % 11) === 11
                            ? '0'
                            : 11 - (sum % 11) === 10
                                ? 'k'
                                : String(11 - (sum % 11));

                    return dv === expectedDv;
                },

                defaultMessage(args: ValidationArguments) {
                    return `${args.property} no es un RUT válido`;
                },
            },
        });
    };
}
