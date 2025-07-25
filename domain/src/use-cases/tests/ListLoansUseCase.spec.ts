import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListLoansUseCase } from '../ListLoansUseCase'
import { Loan } from '../../entities/Loan'
import { LoanRepository } from '../../repositories/LoanRepository'

// Datos de prueba
const loan1 = new Loan('1', 'user-1', 'book-1', new Date(), new Date())
const loan2 = new Loan('2', 'user-2', 'book-2', new Date(), new Date())

describe('ListLoansUseCase', () => {
  let loanRepositoryMock: LoanRepository
  let listLoansUseCase: ListLoansUseCase

  beforeEach(() => {
    loanRepositoryMock = {
      findActiveByUserAndBook: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    }
    listLoansUseCase = new ListLoansUseCase(loanRepositoryMock)
  })

  it('debería retornar todos los préstamos si el requester es admin', async () => {
    ;(loanRepositoryMock.findAll as any).mockResolvedValue([loan1, loan2])
    const result = await listLoansUseCase.execute({
      requesterId: 'admin-id',
      requesterRole: 'admin',
    })
    expect(result.loans).toEqual([loan1, loan2])
    expect(loanRepositoryMock.findAll).toHaveBeenCalledOnce()
    expect(loanRepositoryMock.findByUserId).not.toHaveBeenCalled()
  })

  it('debería retornar solo los préstamos del usuario si el requester es user', async () => {
    ;(loanRepositoryMock.findByUserId as any).mockResolvedValue([loan1])
    const result = await listLoansUseCase.execute({
      requesterId: 'user-1',
      requesterRole: 'user',
    })
    expect(result.loans).toEqual([loan1])
    expect(loanRepositoryMock.findByUserId).toHaveBeenCalledWith('user-1')
    expect(loanRepositoryMock.findAll).not.toHaveBeenCalled()
  })

  it('debería manejar el caso cuando no hay préstamos', async () => {
    ;(loanRepositoryMock.findAll as any).mockResolvedValue([])
    const result = await listLoansUseCase.execute({
      requesterId: 'admin-id',
      requesterRole: 'admin',
    })
    expect(result.loans).toEqual([])
  })
})
