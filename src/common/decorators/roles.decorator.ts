import { SetMetadata } from '@nestjs/common';
import { user_role_type } from 'generated/prisma/enums';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: user_role_type[]) => SetMetadata(ROLES_KEY, roles);