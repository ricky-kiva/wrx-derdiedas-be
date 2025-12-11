import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import DeleteUserUseCase from '../../../../applications/use-cases/user/delete/DeleteUserUseCase';
import GetUserPointUseCase from '../../../../applications/use-cases/user/get-point/GetUserPointUseCase';
import { Request, Response } from 'express';
import { UpdateUserPayloadSchema, UserIdParamSchema } from '../../adapters/validation/user/schemas';
import ApiResponse from '../../types/ApiResponse';
import UpdateUserUseCase from '../../../../applications/use-cases/user/update/UpdateUserUseCase';
import HeaderUtils from '../../shared/HeaderUtils';

@injectable()
export default class UserHandler {
  constructor(
    @inject(DITokens.HeaderUtils)
    private readonly headerUtils: HeaderUtils,
    @inject(DITokens.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @inject(DITokens.GetUserPointUseCase)
    private readonly getUserPointUseCase: GetUserPointUseCase,
    @inject(DITokens.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {
    this.getPoint = this.getPoint.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getPoint(req: Request, res: Response) {
    const { id } = UserIdParamSchema.parse(req.params);

    const point = await this.getUserPointUseCase.execute(id);

    res.json({
      status: 'success',
      data: { point }
    } satisfies ApiResponse);
  }

  async update(req: Request, res: Response) {
    const id = this.headerUtils.extractUserId(req);
    const p = UpdateUserPayloadSchema.parse(req.body);

    const updatedUser = await this.updateUserUseCase.execute({ id, payload: p });

    res.json({
      status: 'success',
      data: { ...updatedUser }
    } satisfies ApiResponse);
  }

  async delete(req: Request, res: Response) {
    const id = this.headerUtils.extractUserId(req);

    await this.deleteUserUseCase.execute(id);

    res.status(204).send();
  }
}
