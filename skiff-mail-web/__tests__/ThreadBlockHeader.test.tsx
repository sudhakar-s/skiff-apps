import { MockedProvider } from '@apollo/client/testing';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { abbreviateWalletAddress } from 'skiff-front-utils';

import { MOCK_EMAIL } from '../__mocks__/mockEmail';
import { ThreadBlockHeader } from '../components/Thread/ThreadBlockHeader';
import { skemailDraftsReducer } from '../redux/reducers/draftsReducer';
import { skemailModalReducer } from '../redux/reducers/modalReducer';

jest.mock('../hooks/useSearchWorker', () => ({
  getSearchWorker: undefined
}));
jest.mock('skiff-front-utils', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const original = jest.requireActual('skiff-front-utils');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    useToast: () => ({ enqueueToast: jest.fn(), closeToast: jest.fn() })
  };
});
jest.mock('../hooks/useDrafts', () => ({
  useDrafts: () => ({
    composeNewDraft: jest.fn()
  })
}));

const mockEmail = {
  ...MOCK_EMAIL,
  decryptedAttachmentMetadata: [],
  attachmentMetadata: []
};
const ethAddress = `0x${'a'.padStart(40, 'a')}`;
const solAddress = `${'A'.padStart(44, 'A')}`;

const originalOpen = window.open;

export const createStore = () =>
  configureStore({
    reducer: {
      mobileDrawer: skemailModalReducer.reducer,
      draft: skemailDraftsReducer.reducer
    }
  });

describe('ThreadBlockHeader', () => {
  // TODO: Move wrapper setup to util file https://redux.js.org/usage/writing-tests
  const wrapper = ({ children }) => (
    <Provider store={createStore()}>
      <MockedProvider>{children}</MockedProvider>
    </Provider>
  );

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    // Cleanup
    window.open = originalOpen;
  });

  it('renders sender name and address', async () => {
    const address = 'address';
    const name = 'name';
    const sender = { address, name };
    const email = { ...mockEmail, from: sender };
    render(
      <ThreadBlockHeader
        disableOnClick={false}
        email={email}
        expanded={false}
        moreButtonRef={React.createRef<HTMLDivElement>()}
        onClick={jest.fn()}
        reply={jest.fn()}
        setShowMoreOptions={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText(sender.name)).toBeInTheDocument();
    expect(screen.getByText(`<${sender.address}>`)).toBeInTheDocument();
  });

  it('renders ENS name for sender with display name', () => {
    const ensName = 'test.eth';
    const sender = { address: `${ensName}@skiff.town`, name: 'Test ENS' };
    const email = { ...mockEmail, from: sender };
    render(
      <ThreadBlockHeader
        disableOnClick={false}
        email={email}
        expanded={false}
        moreButtonRef={React.createRef<HTMLDivElement>()}
        onClick={jest.fn()}
        reply={jest.fn()}
        setShowMoreOptions={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText(ensName)).toBeInTheDocument();
  });

  it('renders abbreviated eth address for sender without display name', () => {
    const abbreviatedWalletAddress = abbreviateWalletAddress(ethAddress);
    const sender = { address: `${ethAddress}@skiff.town` };
    const email = { ...mockEmail, from: sender };
    render(
      <ThreadBlockHeader
        disableOnClick={false}
        email={email}
        expanded={false}
        moreButtonRef={React.createRef<HTMLDivElement>()}
        onClick={jest.fn()}
        reply={jest.fn()}
        setShowMoreOptions={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText(`${abbreviatedWalletAddress}@skiff.town`)).toBeInTheDocument();
  });

  it('renders abbreviated sol address for sender without display name', () => {
    const abbreviatedWalletAddress = abbreviateWalletAddress(solAddress);
    const sender = { address: `${solAddress}@skiff.town` };
    const email = { ...mockEmail, from: sender };
    render(
      <ThreadBlockHeader
        disableOnClick={false}
        email={email}
        expanded={false}
        moreButtonRef={React.createRef<HTMLDivElement>()}
        onClick={jest.fn()}
        reply={jest.fn()}
        setShowMoreOptions={jest.fn()}
      />,
      { wrapper }
    );

    expect(screen.getByText(`${abbreviatedWalletAddress}@skiff.town`)).toBeInTheDocument();
  });
});
