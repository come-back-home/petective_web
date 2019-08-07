import { config } from '../config'

export const getImageUrl = url => url ? `${config.imageUrl}${url}` : null
