import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {
    BookOutlined,
    PaletteOutlined,
    Refresh as RefreshIcon,
    Download as DownloadIcon
} from '@mui/icons-material';

const customColors = {
    primaryPurple: '#6D28D9',
    secondaryPurple: '#5B21B6',
    infoIndigo: '#4F46E5',
    backgroundLight: '#F9FAFB',
};

const dalleOptions = [
    { value: 'dall-e-3', label: 'DALL-E 3 (최신)' },
    { value: 'dall-e-2', label: 'DALL-E 2' },
];

const SelectInput = ({ options, label, value, onChange }) => {
    return (
        <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
            <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
            <Select
                labelId={`select-label-${label}`}
                id={`select-${label}`}
                value={value}
                label={label}
                onChange={onChange}
                sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: `${customColors.primaryPurple}80`
                    }
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const NewBookCoverPage = () => {
    const bookData = {
        bookId: 456,
        createdAt: '2023-10-01 14:30',
        updatedAt: '2024-05-20 09:15',
        title: '책 제목입니다. 이 제목을 기반으로 표지를 만들 수 있습니다.',
        content: '이 책의 주요 내용은 인공지능이 인간의 창작 활동에 미치는 영향과 미래의 협업 방식에 대한 심층적인 분석입니다. 배경은 푸른색 계열로 해주세요.',
    };

    const MOCK_COVER_URL = 'https://placehold.co/300x450/4F46E5/F9FAFB?text=Current+Book+Cover';

    const [apiKey, setApiKey] = useState('');
    const [selectedDalleVersion, setSelectedDalleVersion] = useState(dalleOptions[0].value);
    const [prompt, setPrompt] = useState(bookData.content);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageSeverity, setMessageSeverity] = useState('info');
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const handleRegenerateCover = async () => {
        setMessage(null);

        if (!apiKey.trim() || !prompt.trim()) {
            setMessageSeverity('warning');
            setMessage("API 키와 생성 프롬프트를 모두 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setMessageSeverity('info');
        setMessage(`[${selectedDalleVersion}] 모델로 표지 생성 중...`);

        try {
            const response = await fetch(
                'https://api.openai.com/v1/images/generations',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: selectedDalleVersion,
                        prompt: prompt,
                        size: selectedDalleVersion === 'dall-e-3' ? '1024x1792' : '512x512',
                        quality: selectedDalleVersion === 'dall-e-3' ? 'standard' : undefined,
                        n: 1,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || '이미지 생성에 실패했습니다.');
            }

            const data = await response.json();
            const imageUrl = data?.data?.[0]?.url;

            if (!imageUrl) {
                throw new Error('이미지 URL을 받지 못했습니다.');
            }

            setGeneratedImageUrl(imageUrl);
            setMessageSeverity('success');
            setMessage('🎉 AI 표지 생성 완료');

        } catch (err) {
            console.error('표지 생성 오류:', err);
            setMessageSeverity('error');
            setMessage(`❌ 이미지 생성 실패: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedImageUrl) return;

        try {
            const response = await fetch(generatedImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `book-cover-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('다운로드 오류:', err);
            setMessageSeverity('error');
            setMessage('이미지 다운로드에 실패했습니다.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 3, lg: 6 }, mb: 6 }}>
            <Paper
                elevation={5}
                sx={{
                    p: { xs: 4, sm: 6, md: 8 },
                    borderRadius: '16px',
                    boxShadow: 8
                }}
            >
                {message && (
                    <Alert
                        severity={messageSeverity}
                        sx={{
                            mb: 4,
                            borderRadius: '8px',
                            borderLeft: `4px solid ${messageSeverity === 'info'
                                ? customColors.infoIndigo : messageSeverity === 'warning'
                                    ? '#ff9800' : messageSeverity === 'success'
                                        ? '#4CAF50' : '#F44336'}`,
                            backgroundColor: `${customColors.backgroundLight}cc`,
                        }}
                    >
                        {message}
                    </Alert>
                )}

                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: 'text.primary',
                        fontWeight: 'extrabold',
                        borderBottom: `2px solid ${customColors.primaryPurple}1a`,
                        pb: 2,
                        mb: 5
                    }}
                >
                    🎨 AI 도서 표지 생성 및 수정
                </Typography>

                <Grid container spacing={{ xs: 4, sm: 6, lg: 8 }}>
                    <Grid item xs={12} sm={5}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                color: customColors.infoIndigo,
                                mb: 3,
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <BookOutlined sx={{ mr: 1 }} /> 도서 정보 미리보기
                        </Typography>

                        <Paper
                            elevation={6}
                            sx={{
                                p: 3,
                                borderRadius: '12px',
                                bgcolor: 'white',
                                border: `1px solid ${customColors.infoIndigo}1a`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'box-shadow 0.3s',
                                '&:hover': {
                                    boxShadow: 10,
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '220px',
                                    aspectRatio: '2 / 3',
                                    mb: 3,
                                    boxShadow: 8,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: `3px solid ${customColors.primaryPurple}`
                                }}
                            >
                                <img
                                    src={MOCK_COVER_URL}
                                    alt="Current Book Cover"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/300x450/cccccc/000000?text=Image+Error"
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h5"
                                component="h3"
                                sx={{
                                    fontWeight: 'extrabold',
                                    textAlign: 'center',
                                    color: 'text.primary',
                                    mb: 1,
                                    px: 1,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                }}
                            >
                                {bookData.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    mb: 3,
                                    fontStyle: 'italic',
                                    px: 1,
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3
                                }}
                            >
                                {bookData.content}
                            </Typography>

                            <Box
                                sx={{
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                    width: '100%',
                                    borderTop: `1px solid #E5E7EB`,
                                    pt: 2,
                                    mt: 'auto'
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 0.5
                                }}>
                                    <Typography component="strong" sx={{
                                        fontWeight: 'bold',
                                        color: 'text.primary',
                                        fontSize: 'inherit'
                                    }}>생성일:</Typography>
                                    <Typography component="span" sx={{
                                        fontFamily: 'monospace',
                                        fontSize: 'inherit'
                                    }}>{bookData.createdAt}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography component="strong" sx={{
                                        fontWeight: 'bold',
                                        color: 'text.primary',
                                        fontSize: 'inherit'
                                    }}>수정일:</Typography>
                                    <Typography component="span" sx={{
                                        fontFamily: 'monospace',
                                        fontSize: 'inherit'
                                    }}>{bookData.updatedAt}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={7}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                color: customColors.primaryPurple,
                                mb: 3,
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <PaletteOutlined sx={{ mr: 1 }} /> AI 생성 설정
                        </Typography>

                        <Paper
                            elevation={1}
                            sx={{
                                p: 3,
                                borderRadius: '12px',
                                bgcolor: `${customColors.primaryPurple}0d`,
                                mb: 4,
                                border: `1px solid ${customColors.primaryPurple}1a`
                            }}
                        >
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="API Key (보안 입력)"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-..."
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                bgcolor: 'white',
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <SelectInput
                                        options={dalleOptions}
                                        label="AI 모델 선택"
                                        value={selectedDalleVersion}
                                        onChange={(e) => setSelectedDalleVersion(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                color: customColors.primaryPurple,
                                mb: 3,
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            ✨ 표지 생성 프롬프트
                        </Typography>

                        <TextField
                            fullWidth
                            label="AI 표지 생성 프롬프트"
                            multiline
                            rows={7}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="도서의 주제나 원하는 스타일을 상세하게 묘사해주세요. 예: '신비로운 숲 속에 홀로 서 있는 검은색 고양이, 미니멀리즘 디지털 아트 스타일'"
                            variant="outlined"
                            sx={{
                                mb: 4,
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                            onClick={handleRegenerateCover}
                            disabled={isLoading || !apiKey.trim() || !prompt.trim()}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                bgcolor: customColors.primaryPurple,
                                '&:hover': {
                                    bgcolor: customColors.secondaryPurple,
                                    boxShadow: 3,
                                },
                                '&.Mui-disabled': {
                                    bgcolor: `${customColors.primaryPurple}4d`,
                                    color: '#ffffffb3',
                                }
                            }}
                        >
                            {isLoading ? '표지 생성 요청 중...' : '새로운 표지 생성 요청'}
                        </Button>

                        <Typography
                            variant="caption"
                            display="block"
                            align="center"
                            sx={{ mt: 3, color: 'text.secondary' }}
                        >
                            * 이 작업은 선택하신 모델을 기반으로 새로운 표지 이미지를 생성하며, 실제 API 호출 비용이 발생할 수 있습니다.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {generatedImageUrl && (
                <Paper
                    elevation={4}
                    sx={{
                        mt: 5,
                        p: 3,
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid #E5E7EB',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ✅ 생성된 표지 이미지
                    </Typography>

                    <Box
                        sx={{
                            maxWidth: 300,
                            mx: 'auto',
                            aspectRatio: '2 / 3',
                            mb: 3,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: 5,
                        }}
                    >
                        <img
                            src={generatedImageUrl}
                            alt="Generated Cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        value={generatedImageUrl}
                        size="small"
                        label="이미지 URL"
                        InputProps={{ readOnly: true }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{
                            py: 1.5,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                        }}
                    >
                        표지 이미지 다운로드
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default NewBookCoverPage;