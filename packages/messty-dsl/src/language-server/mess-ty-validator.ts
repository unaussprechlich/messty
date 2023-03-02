import { ValidationAcceptor, ValidationChecks } from 'langium';
import { MessTyAstType } from './generated/ast';
import type { MessTyServices } from './mess-ty-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: MessTyServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.MessTyValidator;
    const checks: ValidationChecks<MessTyAstType> = {

    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class MessTyValidator {

    checkPersonStartsWithCapital(person: any, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
