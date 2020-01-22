import * as yup from 'yup'

import { isString } from 'lodash'

const updateComment = {
  authRequired: true,
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
  beforeResolve: async (args, { commentService, logger }) => {
    const { id, data } = args
    const comment = await commentService.findOne({ where: { id, author: args.user } })

    logger.info('CommentMutation#updateComment.target', comment)

    if (!comment) {
      throw new Error('Comment not found or you may not be the owner of the comment')
    }

    if (isString(data.text)) {
      comment.text = data.text
    }

    return { id, comment }
  },
  resolve: async (parent, { id, comment }, { commentService }) => {
    const updatedComment = await commentService.update(id, comment)

    return { updatedComment }
  }
}

export default { updateComment }
