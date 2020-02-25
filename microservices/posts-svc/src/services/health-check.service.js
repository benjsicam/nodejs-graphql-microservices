import { Implementation } from 'grpc-health-check'

class HealthCheckService {
  constructor(serviceName) {
    this._serviceName = serviceName
  }

  async getServiceImpl() {
    const serviceName = this._serviceName
    const statusMap = {
      '': proto.grpc.health.v1.HealthCheckResponse.ServingStatus.NOT_SERVING
    }

    statusMap[serviceName] = proto.grpc.health.v1.HealthCheckResponse.ServingStatus.SERVING

    const healthCheckImpl = new Implementation(statusMap)

    return {
      'grpc.health.v1.Health': {
        Check: async ({ response }) => {
          const result = await new Promise((resolve, reject) => {
            healthCheckImpl.check(
              {
                request: { getService: () => serviceName }
              },
              (err, res) => {
                if (err) return reject(err)

                return resolve(res)
              }
            )
          })

          response.res = result
        }
      }
    }
  }
}

export default HealthCheckService
