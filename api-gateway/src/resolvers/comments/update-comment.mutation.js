import * as yup from 'yup'

import { isString } from 'lodash'

const updateComment = {
  authenticate: true,
  authorize: async (parent, { id, user }, { commentService }) => {
    const count = await commentService.count({ where: { id, author: user } })

    if (count <= 0) {
      throw new Error('You are not allowed to edit this comment.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.'),
    data: yup.object().shape({
      text: yup
        .string()
        .trim()
        .min(5, 'Text should at least be 5 characters.')
        .max(500, 'Text should be 500 characters at most.')
    })
  }),
  resolve: async (parent, { id, data, user }, { commentService, logger }) => {
    const comment = await commentService.findOne({ where: { id, author: user } })

    logger.info('CommentMutation#updateComment.target', comment)

    if (isString(data.text)) {
      comment.text = data.text
    }

    const updatedComment = await commentService.update(id, comment)

    return { comment: updatedComment }
  }
}

export default { updateComment }
