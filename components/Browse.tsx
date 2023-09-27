import { useCodelessStore } from '@/stores/codeless'
import {
  CircularProgress,
  Container,
  Drawer,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { Message } from 'ai'
import axios from 'axios'
import { FC, useEffect, useRef, useState } from 'react'

interface Component {
  id: string
  image: string
}

export const Browse: FC = () => {
  const showComponents = useCodelessStore((state) => state.showComponents)
  const setShowComponents = useCodelessStore((state) => state.setShowComponents)

  const setIsLoading = useCodelessStore((state) => state.setIsLoading)
  const load = useCodelessStore((state) => state.load)
  // const setMessages = useCodelessStore((state) => state.setMessages)

  const [components, setComponents] = useState<Component[]>([])
  const [isLoadingBrowse, setIsLoadingBrowse] = useState(false)

  const handleLoadComponent = async (component: string) => {
    setShowComponents(false)

    setIsLoading(true)

    await load(component)

    history.pushState({}, '', `/code/${component}`)

    setIsLoading(false)
  }

  const init = async () => {
    setIsLoadingBrowse(true)

    const res = await axios({
      method: 'POST',
      url: '/api/code/listCode',
    })

    setComponents(
      res.data.code.map((c: any) => ({
        id: c.id.slice(5),
        image: c.image,
      }))
    )

    setIsLoadingBrowse(false)
  }

  useEffect(() => {
    if (showComponents) {
      init()
    }
  }, [showComponents])

  return (
    <>
      <Drawer
        anchor="bottom"
        open={showComponents}
        onClose={() => setShowComponents(false)}
      >
        <Stack p={2}>
          <Container maxWidth="xl">
            <Typography component="h3" mb={4} variant="h4">
              Browse Random
            </Typography>
            {isLoadingBrowse && (
              <Stack alignItems="center" p={5}>
                <CircularProgress sx={{ color: 'black' }} />
              </Stack>
            )}
            {!isLoadingBrowse && (
              <Grid
                container
                sx={{
                  border: '1px #CCC solid',
                }}
              >
                {components.map((component, index) => (
                  <Grid
                    item
                    key={component.id}
                    xs={4}
                    sx={{
                      overflow: 'hidden',
                      border: '1px #CCC solid',
                      position: 'relative',
                      height: '300px',
                    }}
                  >
                    <img
                      src={component.image}
                      style={{ objectFit: 'cover' }}
                      width="100%"
                      height="100%"
                    />
                    <button
                      onClick={() => handleLoadComponent(component.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Stack>
      </Drawer>
    </>
  )
}
