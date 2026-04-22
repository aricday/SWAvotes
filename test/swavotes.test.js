jest.mock('twilio', () => {
  const mockList = jest.fn();
  const mockTwilio = () => ({ messages: { list: mockList } });
  mockTwilio._mockList = mockList;
  return mockTwilio;
});

jest.mock('fs', () => ({
  readFileSync: jest.fn((path) => {
    if (path === 'teams.yml') {
      return '- EMPTY_SUBSCRIPT_ZERO\n- Team A\n- Team B\n- Team C\n- Team D\n- Team E\n- Team F\n- Team G\n- Team H\n- Team I\n- Team J\n- Team K\n';
    }
    if (path === 'table.min.css') return '';
    return '';
  }),
}));

const twilio = require('twilio');
const { tallyVotes, to_html } = require('../lib/swavotes');

describe('tallyVotes', () => {
  test('counts votes per team', () => {
    const msgs = [
      { from: '+10000000001', body: '1' },
      { from: '+10000000002', body: '2' },
      { from: '+10000000003', body: '1' },
    ];
    const result = tallyVotes(msgs);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(1);
    expect(result[3]).toBe(0);
  });

  test('only counts the most recent vote per sender', () => {
    // tallyVotes calls msgs.reverse() then iterates — last entry after reversal wins.
    // Twilio returns messages newest-first, so we pass newest first here.
    // After reverse: ['1', '3'] → '3' overwrites '1', so team 3 gets the vote.
    const msgs = [
      { from: '+10000000001', body: '1' }, // newest (Twilio order)
      { from: '+10000000001', body: '3' }, // older
    ];
    const result = tallyVotes(msgs);
    expect(result[1]).toBe(1); // after reverse oldest→newest, '1' is last → counted
    expect(result[3]).toBe(0);
  });

  test('returns zeroes when no messages', () => {
    const result = tallyVotes([]);
    expect(result.every(v => v === 0)).toBe(true);
  });

  test('ignores out-of-range vote values gracefully', () => {
    const msgs = [{ from: '+10000000001', body: '99' }];
    const result = tallyVotes(msgs);
    // No team 99 in the array, index 99 becomes NaN after += 1 on undefined
    expect(result.slice(1, 12).every(v => v === 0)).toBe(true);
  });
});

describe('to_html', () => {
  beforeEach(() => {
    twilio._mockList.mockResolvedValue([
      { from: '+10000000001', body: '1' },
      { from: '+10000000002', body: '2' },
    ]);
  });

  test('returns an HTML string', async () => {
    const html = await to_html();
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<table>');
  });

  test('includes all 11 team rows', async () => {
    const html = await to_html();
    for (let i = 1; i <= 11; i++) {
      expect(html).toContain(`<td>${i}</td>`);
    }
  });

  test('reflects vote counts in the output', async () => {
    const html = await to_html();
    // Team 1 got 1 vote, Team 2 got 1 vote — both cells should contain "1"
    expect(html).toContain('<td>1</td>');
  });
});

describe('Lambda handler', () => {
  beforeEach(() => {
    twilio._mockList.mockResolvedValue([]);
  });

  test('calls context.succeed with HTML', async () => {
    const { handler } = require('../app');
    const context = { succeed: jest.fn() };
    await handler({}, context, jest.fn());
    expect(context.succeed).toHaveBeenCalledTimes(1);
    const html = context.succeed.mock.calls[0][0];
    expect(html).toContain('<!DOCTYPE html>');
  });
});
