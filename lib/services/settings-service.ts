import 'server-only'

import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

import type { AccountInfo } from '@/modules/settings/types/settings'

function splitName(name: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
    }
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      middleName: '',
      lastName: '',
    }
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(' '),
    lastName: parts[parts.length - 1],
  }
}

function buildFullName(accountInfo: AccountInfo) {
  return [accountInfo.firstName, accountInfo.middleName, accountInfo.lastName]
    .map(value => value.trim())
    .filter(Boolean)
    .join(' ')
}

export async function getSettingsAccount(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      contactNo: true,
      roles: true,
      active: true,
      isDeleted: true,
    },
  })

  if (!user || !user.active || user.isDeleted) {
    throw new Error('User account not found')
  }

  const name = splitName(user.name)

  return {
    accountInfo: {
      firstName: name.firstName,
      middleName: name.middleName,
      lastName: name.lastName,
      email: user.email,
      contactNumber: user.contactNo ?? '',
    },
    roles: user.roles,
  }
}

export async function updateSettingsAccount(userId: number, accountInfo: AccountInfo) {
  const firstName = accountInfo.firstName.trim()
  const middleName = accountInfo.middleName.trim()
  const lastName = accountInfo.lastName.trim()
  const email = accountInfo.email.trim()
  const contactNumber = accountInfo.contactNumber.trim()

  if (!firstName) {
    throw new Error('First name is required')
  }

  if (!lastName) {
    throw new Error('Last name is required')
  }

  if (!email) {
    throw new Error('Email is required')
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: userId,
      },
    },
    select: {
      id: true,
    },
  })

  if (existingUser) {
    throw new Error('Email address is already in use')
  }

  const name = buildFullName({
    firstName,
    middleName,
    lastName,
    email,
    contactNumber,
  })

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      contactNo: contactNumber,
    },
    select: {
      id: true,
      name: true,
      email: true,
      contactNo: true,
      roles: true,
    },
  })

  const updatedName = splitName(user.name)

  return {
    accountInfo: {
      firstName: updatedName.firstName,
      middleName: updatedName.middleName,
      lastName: updatedName.lastName,
      email: user.email,
      contactNumber: user.contactNo ?? '',
    },
    roles: user.roles,
  }
}

export async function updateSettingsPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  if (!currentPassword) {
    throw new Error('Current password is required')
  }

  if (!newPassword) {
    throw new Error('New password is required')
  }

  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
      active: true,
      isDeleted: true,
    },
  })

  if (!user || !user.active || user.isDeleted) {
    throw new Error('User account not found')
  }

  if (!user.password) {
    throw new Error('Password is not configured for this account')
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password)

  if (!passwordMatches) {
    throw new Error('Current password is incorrect')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  })

  return {
    success: true,
  }
}
