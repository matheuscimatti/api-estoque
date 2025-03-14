import DashboardService from '#services/DashboardService'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
    private dashboardService = new DashboardService()

    public async buscarInformacoes({ request, response }: HttpContext) {
        const { setorId } = request.qs()
        const result = await this.dashboardService.buscarInformacoes(setorId)
        return response.status(200).send({
            status: true,
            data: result?.data,
        })
    }
}